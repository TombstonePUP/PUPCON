#!/usr/bin/env bash
#
# deploy_ssm.sh — Deploy Docker images on the pupcon EC2 instance via AWS SSM.
#
# Runs the whole deploy (pull images, sync frontend build, switch containers,
# cleanup) as ONE SSM command with an extended execution timeout, then polls
# that same command's status until it finishes. No background job, no marker
# file, no re-launching commands to check on the first one — get-command-
# invocation on the original command ID gives us status + full stdout/stderr
# directly.
#
# Required environment variables (set in the calling step's `env:`):
#   INSTANCE_ID       - EC2 instance ID
#   ENVIRONMENT       - e.g. staging / production
#   APP_VERSION       - image/app version being deployed
#   AWS_REGION        - AWS region (e.g. ap-southeast-1)
#   ENV_FILE          - name of the env file to write (e.g. .env.production)
#   COMPOSE_FILE      - compose file to use (e.g. docker-compose.prod.run.yml)
#   ENV_FILE_CONTENT  - FULL literal contents to write to the remote env file
#   COMPOSE_FILE_CONTENT - FULL literal contents to write to the remote compose file
#   GITHUB_TOKEN      - token used to log into GHCR on the instance
#   GITHUB_ACTOR      - user to log into GHCR as (optional)
set -euo pipefail

# How long the SSM command is allowed to run on the instance before AWS kills
# it. Raise this instead of building an async job system. Max allowed is
# 172800 (48h); 1800s (30 min) is generous for an image pull + restart.
SSM_EXECUTION_TIMEOUT="${SSM_EXECUTION_TIMEOUT:-1800}"

deploy_via_ssm() {
  : "${INSTANCE_ID:?INSTANCE_ID is required}"
  : "${ENVIRONMENT:?ENVIRONMENT is required}"
  : "${APP_VERSION:?APP_VERSION is required}"
  : "${AWS_REGION:?AWS_REGION is required}"
  : "${ENV_FILE:?ENV_FILE is required}"
  : "${COMPOSE_FILE:?COMPOSE_FILE is required}"
  : "${ENV_FILE_CONTENT:?ENV_FILE_CONTENT is required}"
  : "${COMPOSE_FILE_CONTENT:?COMPOSE_FILE_CONTENT is required}"
  : "${GITHUB_TOKEN:?GITHUB_TOKEN is required}"

  local ghcr_user="${GITHUB_ACTOR:-github-actions}"
  local app_dir="/opt/apps/pupcon-${ENVIRONMENT}"

  # base64-encode the free-form file contents so they're safe to embed in the
  # remote script regardless of quotes/newlines/special chars.
  local env_b64 compose_b64
  env_b64=$(printf '%s' "${ENV_FILE_CONTENT}" | base64 --wrap=0)
  compose_b64=$(printf '%s' "${COMPOSE_FILE_CONTENT}" | base64 --wrap=0)

  # The whole thing runs under `set -e`, so ANY failing command (docker
  # login, pull, run, up, restart) aborts immediately and the SSM command
  # comes back with Status=Failed. Nothing here is allowed to fail silently.
  local remote_script
  remote_script=$(cat <<REMOTE
set -e
mkdir -p ${app_dir}
cd ${app_dir}

echo '${env_b64}' | base64 --decode > ${ENV_FILE}
echo "APP_VERSION=${APP_VERSION}" >> ${ENV_FILE}
echo '${compose_b64}' | base64 --decode > ${COMPOSE_FILE}

# Exported explicitly so every docker compose child process resolves
# \${APP_VERSION} in image tags, regardless of shell/env-file quirks.
export APP_VERSION='${APP_VERSION}'

free_mb=\$(df -m / | awk 'NR==2 {print \$4}')
echo "Free disk: \${free_mb} MB"
if [ "\${free_mb}" -lt 1024 ]; then
  echo "Low disk space, pruning dangling images/build cache before retrying..."
  docker image prune -f
  docker builder prune -f
  free_mb=\$(df -m / | awk 'NR==2 {print \$4}')
  echo "Free disk after cleanup: \${free_mb} MB"
  if [ "\${free_mb}" -lt 1024 ]; then
    echo "Still under 1GB free. Aborting." >&2
    exit 20
  fi
fi

echo "Logging in to GHCR..."
echo '${GITHUB_TOKEN}' | docker login ghcr.io -u '${ghcr_user}' --password-stdin

echo "Pulling images for ${ENVIRONMENT}..."
docker compose --env-file ${ENV_FILE} -f ${COMPOSE_FILE} pull

echo "Syncing frontend build into shared host directory..."
mkdir -p public-build
rm -rf public-build/*
docker run --rm \
  --entrypoint "" \
  -v ${app_dir}/public-build:/out \
  ghcr.io/zero-index-developers/pupcon/pupcon-client:${APP_VERSION} \
  /bin/sh -c "cp -R /var/www/public/build/. /out/"

echo "Switching to new ${ENVIRONMENT} containers..."
docker compose --env-file ${ENV_FILE} -f ${COMPOSE_FILE} up -d

echo "Restarting api-prod to pick up the synced manifest..."
docker compose --env-file ${ENV_FILE} -f ${COMPOSE_FILE} restart api-prod

# Safe cleanup only: dangling images + build cache. Deliberately NOT pruning
# volumes (postgres-data-production lives there) and NOT using
# 'docker image prune -af' (the -a would drop the image still in use if a
# container is mid-restart).
echo "Cleaning up dangling images and build cache..."
docker image prune -f
docker builder prune -f

echo "Deployment complete for ${ENVIRONMENT}"
REMOTE
)

  local params_json
  params_json=$(jq -nc \
    --arg cmd "${remote_script}" \
    --arg timeout "${SSM_EXECUTION_TIMEOUT}" \
    '{commands: [$cmd], executionTimeout: [$timeout]}')

  local command_id
  command_id=$(aws ssm send-command \
    --instance-ids "${INSTANCE_ID}" \
    --document-name "AWS-RunShellScript" \
    --comment "Deploy pupcon ${ENVIRONMENT} ${APP_VERSION}" \
    --parameters "${params_json}" \
    --region "${AWS_REGION}" \
    --query "Command.CommandId" \
    --output text)

  echo "SSM Command ID: ${command_id}"
  echo "Waiting for deploy to finish (timeout: ${SSM_EXECUTION_TIMEOUT}s)..."

  # Poll the SAME command's status — no re-sending commands, no marker file.
  local status="InProgress"
  while [[ "${status}" == "InProgress" || "${status}" == "Pending" ]]; do
    sleep 10
    status=$(aws ssm get-command-invocation \
      --command-id "${command_id}" \
      --instance-id "${INSTANCE_ID}" \
      --region "${AWS_REGION}" \
      --query "Status" \
      --output text)
    echo "Status: ${status}"
  done

  echo "----- deploy output -----"
  aws ssm get-command-invocation \
    --command-id "${command_id}" \
    --instance-id "${INSTANCE_ID}" \
    --region "${AWS_REGION}" \
    --query "StandardOutputContent" \
    --output text
  echo "--------------------------"

  if [[ "${status}" != "Success" ]]; then
    echo "Deploy failed (status=${status})." >&2
    echo "----- stderr -----" >&2
    aws ssm get-command-invocation \
      --command-id "${command_id}" \
      --instance-id "${INSTANCE_ID}" \
      --region "${AWS_REGION}" \
      --query "StandardErrorContent" \
      --output text >&2
    return 1
  fi

  echo "Deployment to ${ENVIRONMENT} completed successfully"
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  deploy_via_ssm
fi
