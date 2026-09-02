#!/usr/bin/env bash
#
# deploy_ssm.sh — Deploy Docker images on the pupcon EC2 instance via AWS SSM.
#
# Pulls the new images onto the instance, switches the containers, and cleans up.
# Invoked by .github/workflows/modules/deploy.yml (see the "Deploy images to EC2
# via SSM" step). Can also be sourced and called as a function:
#
#   source .github/scripts/deploy_ssm.sh && deploy_via_ssm
#
# Required environment variables (set in the calling step's `env:`):
#   INSTANCE_ID       - EC2 instance ID returned by OpenTofu apply
#   ENVIRONMENT       - e.g. staging / production
#   APP_VERSION       - image/app version being deployed
#   AWS_REGION        - AWS region (e.g. ap-southeast-1)
#   ENV_FILE          - name of the env file to write (e.g. .env.production)
#   COMPOSE_FILE      - compose file to use (e.g. docker-compose.prod.run.yml)
#   ENV_FILE_CONTENT  - FULL literal contents to write to the remote env file
#   GITHUB_TOKEN      - token used to log into GHCR on the instance
#   GITHUB_ACTOR      - user to log into GHCR as (optional, defaults to GITHUB_ACTOR env)
set -euo pipefail

deploy_via_ssm() {
  : "${INSTANCE_ID:?INSTANCE_ID is required}"
  : "${ENVIRONMENT:?ENVIRONMENT is required}"
  : "${APP_VERSION:?APP_VERSION is required}"
  : "${AWS_REGION:?AWS_REGION is required}"
  : "${ENV_FILE:?ENV_FILE is required}"
  : "${COMPOSE_FILE:?COMPOSE_FILE is required}"
  : "${ENV_FILE_CONTENT:?ENV_FILE_CONTENT is required}"
  : "${GITHUB_TOKEN:?GITHUB_TOKEN is required}"

  local GHCR_USER="${GITHUB_ACTOR:-github-actions}"
  local instance_env_file="/opt/apps/pupcon-${ENVIRONMENT}/${ENV_FILE}"

  # Build the command body that runs ON the instance via AWS-RunShellScript.
  #
  # NOTE on expansion:
  #   - Variables referenced as ${VAR} in the heredoc below are expanded by the
  #     LOCAL shell when the body is assembled, baking concrete values in.
  #   - ENV_FILE_CONTENT is written verbatim to the remote file, so it is wrapped
  #     in a quoted heredoc (<<'ENVEOF') so the REMOTE shell does not re-expand it.
  local ssm_commands
  ssm_commands=$(cat <<EOF
set -e
echo "Writing ${ENV_FILE} on instance..."
cat > "${instance_env_file}" <<'ENVEOF'
${ENV_FILE_CONTENT}
ENVEOF
echo "APP_VERSION=${APP_VERSION}" >> "${instance_env_file}"
echo "Logging in to GHCR on instance..."
echo "${GITHUB_TOKEN}" | docker login ghcr.io -u "${GHCR_USER}" --password-stdin
cd /opt/apps/pupcon-${ENVIRONMENT}
echo "Pulling images for ${ENVIRONMENT}..."
docker compose --env-file ${ENV_FILE} -f ${COMPOSE_FILE} pull
echo "Switching to new ${ENVIRONMENT} containers..."
docker compose --env-file ${ENV_FILE} -f ${COMPOSE_FILE} up -d
echo "Cleaning up old ${ENVIRONMENT} images..."
docker image prune -f
echo "Deployment complete for ${ENVIRONMENT}"
EOF
)

  local command_id
  command_id=$(aws ssm send-command \
    --instance-ids "${INSTANCE_ID}" \
    --document-name "AWS-RunShellScript" \
    --comment "Deploy pupcon ${ENVIRONMENT} ${APP_VERSION}" \
    --parameters "commands=['''${ssm_commands}''']" \
    --region "${AWS_REGION}" \
    --query "Command.CommandId" \
    --output text)

  echo "SSM Command ID: ${command_id}"
  echo "Waiting for SSM command to complete..."

  local status=""
  while [ "$status" != "Success" ] && [ "$status" != "Failed" ] && [ "$status" != "Cancelled" ]; do
    sleep 15
    status=$(aws ssm get-command-invocation \
      --command-id "${command_id}" \
      --instance-id "${INSTANCE_ID}" \
      --region "${AWS_REGION}" \
      --query "Status" \
      --output text)
    echo "Command status: ${status}"
  done

  local detailed
  detailed=$(aws ssm get-command-invocation \
    --command-id "${command_id}" \
    --instance-id "${INSTANCE_ID}" \
    --region "${AWS_REGION}" \
    --query "{Status:Status,StatusCode:StatusCode,StdErrContent:StandardErrorContent}" \
    --output json)
  echo "${detailed}"

  if [ "$status" != "Success" ]; then
    echo "SSM command failed. See output above." >&2
    return 1
  fi

  echo "Deployment to ${ENVIRONMENT} completed successfully"
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  deploy_via_ssm
fi
