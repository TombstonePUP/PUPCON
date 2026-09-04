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
#   COMPOSE_FILE_CONTENT - FULL literal contents to write to the remote compose file
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
  : "${COMPOSE_FILE_CONTENT:?COMPOSE_FILE_CONTENT is required}"
  : "${GITHUB_TOKEN:?GITHUB_TOKEN is required}"

  local GHCR_USER="${GITHUB_ACTOR:-github-actions}"
  local instance_env_file="/opt/apps/pupcon-${ENVIRONMENT}/${ENV_FILE}"
  local instance_compose_file="/opt/apps/pupcon-${ENVIRONMENT}/${COMPOSE_FILE}"

  local app_dir="/opt/apps/pupcon-${ENVIRONMENT}"
  local deploy_script="${app_dir}/deploy.sh"
  local deploy_log="${app_dir}/deploy-${APP_VERSION}.log"
  local done_marker="${app_dir}/deploy-${APP_VERSION}.done"

  # Build the command body that runs ON the instance via AWS-RunShellScript.
  #
  # This step only WRITES the env/compose files and a deploy script, then kicks
  # that script off in the BACKGROUND (nohup ... &). It returns in a few seconds.
  #
  # The heavy work (docker pull, the build-sync `docker run`, `docker compose
  # up`) runs OUTSIDE the SSM command so the multi-minute job is not killed by
  # the AWS-RunShellScript execution timeout ("ipc messaging received timeout
  # signal"). Progress and the exit code are written to files on the instance
  # and polled by the next phase.
  #
  # ── Assemble the deploy script that runs ON the instance ──────────────────
  #
  # All vars in this heredoc are expanded NOW by the LOCAL shell (`${app_dir}`,
  # `${ENV_FILE}`, `${COMPOSE_FILE}`, `${ENVIRONMENT}`, `${APP_VERSION}`), baking
  # in concrete values. The GHCR credentials are single-quoted via bash's `${@Q}`
  # so they are safe to re-emit. Only the runtime references (`${GITHUB_TOKEN}`,
  # `${GHCR_USER}`, `${exit_code}`, `$?`, `\${free_mb}`, `\${free_mb:-0}`) are
  # escaped to stay literal on the instance. The whole script is then base64-
  # encoded so the outer quotes/shell cannot mangle it, and decoded on the
  # instance.
  #
  # Build the body via an UNQUOTED heredoc so the LOCAL vars bake in now.
  local deploy_body
  deploy_body=$(cat <<DEBUEOF
#!/usr/bin/env bash
set -e
export GHCR_USER=${GHCR_USER@Q}
export GITHUB_TOKEN=${GITHUB_TOKEN@Q}
# APP_VERSION must be exported so every `docker compose` child resolves the
# ${APP_VERSION} interpolation in the compose file (image tags like
# ghcr.io/.../pupcon-api:${APP_VERSION}). It is baked in as a literal here so it
# is always set, regardless of the env-file or ssh non-interactive shell.
export APP_VERSION='${APP_VERSION}'

# SAFE cleanup: only remove DANGLING images (none-tagged, not referenced by any
# container) and the build cache. We deliberately DO NOT prune volumes here —
# docker volume prune removes ALL unused volumes, and postgres-data-production
# is the app database; a brief unref during restart would destroy it. We also do
# NOT use `docker image prune -af` because `-a` drops ALL unused images,
# including the currently-running image tag if the container is mid-restart.
prune_cleanup() {
  echo "[cleanup] Pruning dangling images (safe)..."
  docker image prune -f > /dev/null 2>&1 || true
  echo "[cleanup] Pruning build cache (safe)..."
  docker builder prune -f > /dev/null 2>&1 || true
}

deploy() {
  echo "==== deploy.sh starting (APP_VERSION=${APP_VERSION}) ===="
  # Free space before the heavy pull — fail fast with a clear message instead
  # of timing out mid-pull due to a full disk.
  local free_mb=\$(df -m / | awk 'NR==2 {print \$4}')
  echo "Free disk before pull: \${free_mb} MB"
  if [ "\${free_mb:-0}" -lt 1024 ]; then
    echo "ERROR: Less than 1 GB free on /. Running cleanup before retry..."
    prune_cleanup
    free_mb=\$(df -m / | awk 'NR==2 {print \$4}')
    echo "Free disk after cleanup: \${free_mb} MB"
    if [ "\${free_mb:-0}" -lt 1024 ]; then
      echo "ERROR: Still < 1 GB free after cleanup. Aborting."
      exit 20
    fi
  fi

  echo "Logging in to GHCR on instance..."
  echo "\${GITHUB_TOKEN}" | docker login ghcr.io -u "\${GHCR_USER}" --password-stdin

  cd ${app_dir}
  echo "Pulling images for ${ENVIRONMENT}..."
  docker compose --env-file ${ENV_FILE} -f ${COMPOSE_FILE} pull

  echo "Syncing frontend build into shared host directory..."
  mkdir -p ${app_dir}/public-build
  # Extract the freshly-built public/build from the pupcon-client image into the
  # shared bind-mount directory. Because public/build is a build artifact that is
  # NOT committed to git and builds only inside the frontend image, we sync it
  # from the image on every deploy so api-prod (which renders Blade/@vite and
  # needs manifest.json) always has the build matching the current image.
  rm -rf ${app_dir}/public-build/*
  docker run --rm \
    --entrypoint "" \
    -v ${app_dir}/public-build:/out \
    ghcr.io/zero-index-developers/pupcon/pupcon-client:${APP_VERSION} \
    /bin/sh -c "cp -R /var/www/public/build/. /out/"

  echo "Switching to new ${ENVIRONMENT} containers..."
  docker compose --env-file ${ENV_FILE} -f ${COMPOSE_FILE} up -d
  echo "Restarting api-prod to pick up the synced manifest..."
  docker compose --env-file ${ENV_FILE} -f ${COMPOSE_FILE} restart api-prod || true

  # Clean up after a successful deploy so images/volumes/cache don't accumulate
  # and eventually fill the disk again.
  prune_cleanup
  echo "Deployment complete for ${ENVIRONMENT}"
}

if deploy > "${deploy_log}" 2>&1; then
  exit_code=0
else
  exit_code=\$?
fi
echo "EXIT_CODE=\${exit_code}" > "${done_marker}"
exit 0
DEBUEOF
)

  # base64-encode the three "free-form" payloads so embedding them in the outer
  # SSM command string is safe regardless of `$`, backticks, quotes, or newlines.
  local env_file_b64
  local compose_file_b64
  local deploy_script_b64
  env_file_b64=$(printf '%s' "${ENV_FILE_CONTENT}" | base64 --wrap=0)
  compose_file_b64=$(printf '%s' "${COMPOSE_FILE_CONTENT}" | base64 --wrap=0)
  deploy_script_b64=$(printf '%s' "${deploy_body}" | base64 --wrap=0)

  local ssm_commands
  ssm_commands=$(cat <<EOF
set -e
mkdir -p ${app_dir}
echo "Writing ${ENV_FILE} on instance..."
printf '%s' "${env_file_b64}" | base64 --decode > "${instance_env_file}"
echo "APP_VERSION=${APP_VERSION}" >> "${instance_env_file}"
echo "Writing ${COMPOSE_FILE} on instance..."
printf '%s' "${compose_file_b64}" | base64 --decode > "${instance_compose_file}"
echo "Writing deploy script on instance..."
printf '%s' "${deploy_script_b64}" | base64 --decode > "${deploy_script}"
chmod +x "${deploy_script}"
rm -f "${done_marker}" "${deploy_log}"
echo "Launching deploy in background on instance..."
nohup "${deploy_script}" > /dev/null 2>&1 &
echo "Deploy launched (pid \$!)."
EOF
)

  local params_json
  params_json=$(jq -nc --arg cmds "${ssm_commands}" '{commands: [$cmds]}')

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
  echo "Waiting for SSM command to complete..."

  local status=""
  while [ "$status" != "Success" ] && [ "$status" != "Failed" ] && [ "$status" != "Cancelled" ]; do
    sleep 5
    status=$(aws ssm get-command-invocation \
      --command-id "${command_id}" \
      --instance-id "${INSTANCE_ID}" \
      --region "${AWS_REGION}" \
      --query "Status" \
      --output text)
    echo "Command status: ${status}"
  done

  if [ "$status" != "Success" ]; then
    echo "Failed to launch background deploy (SSM status=${status})."
    aws ssm get-command-invocation \
      --command-id "${command_id}" \
      --instance-id "${INSTANCE_ID}" \
      --region "${AWS_REGION}" \
      --query "{Status:Status,StatusCode:StatusCode,StdErrContent:StandardErrorContent,StdOutContent:StandardOutputContent}" \
      --output json
    return 1
  fi
  echo "Background deploy started. Polling ${done_marker} on instance..."

  # Poll the instance with a short SSM command until the background job writes
  # its exit-code marker. Each poll is tiny, so it stays under the SSM timeout.
  local attempts=0
  local max_attempts=120   # 120 * ~18s ≈ 36 min cap, then report the log tail
  local poll_status=""
  local exit_code=""
  local poll_id=""
  local started_at; started_at=$(date +%s)
  while [ "${attempts}" -lt "${max_attempts}" ]; do
    sleep 15
    attempts=$((attempts + 1))
    local elapsed=$(( $(date +%s) - started_at ))
    echo "Polling attempt ${attempts}/${max_attempts} (${elapsed}s elapsed)..."
    poll_status=$(aws ssm send-command \
      --instance-ids "${INSTANCE_ID}" \
      --document-name "AWS-RunShellScript" \
      --comment "poll pupcon ${ENVIRONMENT} deploy" \
      --parameters "$(jq -nc --arg cmds "cat ${done_marker} 2>/dev/null || true" '{commands: [$cmds]}')" \
      --region "${AWS_REGION}" \
      --query "Command.CommandId" \
      --output text)
    # Give the poll a moment to run, then read its output.
    sleep 3
    exit_code=$(aws ssm get-command-invocation \
      --command-id "${poll_status}" \
      --instance-id "${INSTANCE_ID}" \
      --region "${AWS_REGION}" \
      --query "StandardOutputContent" \
      --output text 2>/dev/null | grep -oE 'EXIT_CODE=[0-9]+' || true)
    if [ -n "${exit_code}" ]; then
      echo "Deploy finished: ${exit_code}"
      echo "----- deploy log tail -----"
      log_command=$(aws ssm send-command \
        --instance-ids "${INSTANCE_ID}" \
        --document-name "AWS-RunShellScript" \
        --comment "tail pupcon deploy log" \
        --parameters "$(jq -nc --arg cmds "tail -n 80 ${deploy_log}" '{commands: [$cmds]}')" \
        --region "${AWS_REGION}" \
        --query "Command.CommandId" \
        --output text)
      sleep 3
      aws ssm get-command-invocation \
        --command-id "${log_command}" \
        --instance-id "${INSTANCE_ID}" \
        --region "${AWS_REGION}" \
        --query "StandardOutputContent" \
        --output text
      echo "--------------------------"
      case "${exit_code}" in
        EXIT_CODE=0) echo "Deployment to ${ENVIRONMENT} completed successfully"; return 0 ;;
        *) echo "Deploy script failed on instance (exit ${exit_code#EXIT_CODE=})." >&2; return 1 ;;
      esac
    fi
  done

  # Timed out — surface the deploy log and running processes so a stuck deploy
  # is diagnosable instead of a silent 36-minute black box.
  echo "Timed out waiting for background deploy to finish (${max_attempts} attempts)." >&2
  echo "----- deploy log tail on timeout -----"
  log_command=$(aws ssm send-command \
    --instance-ids "${INSTANCE_ID}" \
    --document-name "AWS-RunShellScript" \
    --comment "tail pupcon deploy log on timeout" \
    --parameters "$(jq -nc --arg cmds "tail -n 80 ${deploy_log}" '{commands: [$cmds]}')" \
    --region "${AWS_REGION}" \
    --query "Command.CommandId" \
    --output text)
  sleep 3
  aws ssm get-command-invocation \
    --command-id "${log_command}" \
    --instance-id "${INSTANCE_ID}" \
    --region "${AWS_REGION}" \
    --query "StandardOutputContent" \
    --output text
  echo "----- running deploy.sh processes -----"
  ps_command=$(aws ssm send-command \
    --instance-ids "${INSTANCE_ID}" \
    --document-name "AWS-RunShellScript" \
    --comment "ps pupcon deploy" \
    --parameters "$(jq -nc --arg cmds "ps -ef | grep -E 'deploy.sh|docker compose|docker run' | grep -v grep || true" '{commands: [$cmds]}')" \
    --region "${AWS_REGION}" \
    --query "Command.CommandId" \
    --output text)
  sleep 3
  aws ssm get-command-invocation \
    --command-id "${ps_command}" \
    --instance-id "${INSTANCE_ID}" \
    --region "${AWS_REGION}" \
    --query "StandardOutputContent" \
    --output text
  echo "--------------------------------------------------------------------------" >&2
  echo "Check ${deploy_log} on the instance for progress." >&2
  return 1
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  deploy_via_ssm
fi
