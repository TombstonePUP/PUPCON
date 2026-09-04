#!/usr/bin/env bash
#
# deploy_ssm.sh — Deploy Docker images on the pupcon EC2 instance via AWS SSM.
#
# WHY THIS IS BACKGROUND + LOG FILE, NOT ONE LIVE SSM COMMAND:
# `docker pull` / `docker compose pull` emits a rapid, high-volume stream of
# per-layer progress lines. Piping that directly through SSM's live IPC
# channel crashes the SSM agent's document worker:
#   "document process failed unexpectedly: ipc messaging received timeout
#    signal , check [ssm-document-worker]/[ssm-session-worker] log"
# This happens regardless of executionTimeout — it's a volume/rate problem,
# not a duration problem. So the heavy work is redirected to a log file on
# the instance and run in the background; SSM is only ever asked to run
# small, cheap commands (launch, and repeated small polls).
#
# WHAT'S DIFFERENT FROM THE PREVIOUS VERSION OF THIS SCRIPT:
# 1. Fixed a silent-failure bug: `if deploy > log 2>&1; then` exempted
#    everything inside deploy() from `set -e`, so a failing `docker compose`
#    command would print an error and keep going instead of aborting — the
#    script could report "Deployment complete" after actually failing.
#    Fixed by running deploy() in a subshell with its own explicit `set -e`
#    ( set -e; deploy ), which correctly aborts on the first failure while
#    still letting the outer `if` capture the real exit code.
# 2. Each poll now does ONE combined SSM call that both tails the live log
#    AND checks the completion marker, and prints that tail straight into
#    the GitHub Actions log every cycle — so you see real progress instead
#    of silence until the end. This also removes the separate "tail log on
#    success" and "ps on timeout" commands from before; the tail is already
#    visible throughout.
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
  local deploy_script="${app_dir}/deploy.sh"
  local deploy_log="${app_dir}/deploy-${APP_VERSION}.log"
  local done_marker="${app_dir}/deploy-${APP_VERSION}.done"

  # ── Script that runs ON the instance, in the background ───────────────────
  # Local vars (${app_dir}, ${ENV_FILE}, etc.) are baked in now by the local
  # shell. Runtime-only refs (${GITHUB_TOKEN}, ${GHCR_USER}, \$?, \${free_mb})
  # are escaped to stay literal on the instance.
  local deploy_body
  deploy_body=$(cat <<DEBUEOF
#!/usr/bin/env bash
export GHCR_USER=${ghcr_user@Q}
export GITHUB_TOKEN=${GITHUB_TOKEN@Q}
export APP_VERSION='${APP_VERSION}'

prune_cleanup() {
  # SAFE cleanup: dangling images + build cache. No volume prune (would risk
  # postgres-data-production — a volume can look transiently unreferenced
  # mid-restart), no 'image prune -af' (the -a would drop the image still in
  # use if a container is mid-restart).
  echo "[cleanup] Pruning dangling images (safe)..."
  docker image prune -f > /dev/null 2>&1 || true
  echo "[cleanup] Pruning build cache (safe)..."
  docker builder prune -f > /dev/null 2>&1 || true

  # Old TAGGED versions from previous deploys are NOT dangling (each
  # APP_VERSION is a distinct tag), so 'image prune' above never touches
  # them — they'd otherwise accumulate one full image per deploy forever.
  # Keep only the KEEP_VERSIONS most recent tags per repo (currently-running
  # tag is always one of them since it was just pulled), delete the rest by
  # explicit tag. This never touches images outside these two repos.
  local keep_versions="\${KEEP_IMAGE_VERSIONS:-3}"
  for repo in \
    ghcr.io/zero-index-developers/pupcon/pupcon-client \
    ghcr.io/zero-index-developers/pupcon/pupcon-api
  do
    echo "[cleanup] Pruning old tags for \${repo} (keeping newest \${keep_versions})..."
    docker images "\${repo}" --format '{{.CreatedAt}}|{{.Tag}}' 2>/dev/null \
      | sort -r \
      | awk -F'|' '{print \$2}' \
      | grep -v '^<none>$' \
      | tail -n "+\$((keep_versions + 1))" \
      | while read -r old_tag; do
          echo "[cleanup]   removing \${repo}:\${old_tag}"
          docker rmi "\${repo}:\${old_tag}" > /dev/null 2>&1 || true
        done
  done
}

deploy() {
  echo "==== deploy.sh starting (APP_VERSION=${APP_VERSION}) ===="

  local free_mb
  free_mb=\$(df -m / | awk 'NR==2 {print \$4}')
  echo "Free disk before pull: \${free_mb} MB"
  if [ "\${free_mb:-0}" -lt 1024 ]; then
    echo "ERROR: Less than 1 GB free. Running cleanup before retry..."
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

  prune_cleanup
  echo "Deployment complete for ${ENVIRONMENT}"
}

# Run deploy() in a subshell with its OWN explicit 'set -e'. This is the fix
# for the old silent-failure bug: calling a function directly as an 'if'
# condition exempts it (and everything it calls) from errexit, so a failing
# 'docker compose' command would just print an error and keep going. An
# explicit 'set -e' *inside* the tested subshell is honored even in an 'if'
# context, so the subshell now correctly aborts on the first real failure —
# while the outer 'if' still captures its exit code cleanly.
if ( set -e; deploy ) > "${deploy_log}" 2>&1; then
  exit_code=0
else
  exit_code=\$?
fi
echo "EXIT_CODE=\${exit_code}" > "${done_marker}"
DEBUEOF
)

  local env_file_b64 compose_file_b64 deploy_script_b64
  env_file_b64=$(printf '%s' "${ENV_FILE_CONTENT}" | base64 --wrap=0)
  compose_file_b64=$(printf '%s' "${COMPOSE_FILE_CONTENT}" | base64 --wrap=0)
  deploy_script_b64=$(printf '%s' "${deploy_body}" | base64 --wrap=0)

  local instance_env_file="${app_dir}/${ENV_FILE}"
  local instance_compose_file="${app_dir}/${COMPOSE_FILE}"

  # ── Launch command: tiny output, safe to send live through SSM ────────────
  local launch_commands
  launch_commands=$(cat <<EOF
set -e
mkdir -p ${app_dir}
printf '%s' "${env_file_b64}" | base64 --decode > "${instance_env_file}"
echo "APP_VERSION=${APP_VERSION}" >> "${instance_env_file}"
printf '%s' "${compose_file_b64}" | base64 --decode > "${instance_compose_file}"
printf '%s' "${deploy_script_b64}" | base64 --decode > "${deploy_script}"
chmod +x "${deploy_script}"
rm -f "${done_marker}" "${deploy_log}"
nohup "${deploy_script}" > /dev/null 2>&1 &
echo "Deploy launched (pid \$!)."
EOF
)

  local launch_id
  launch_id=$(aws ssm send-command \
    --instance-ids "${INSTANCE_ID}" \
    --document-name "AWS-RunShellScript" \
    --comment "Deploy pupcon ${ENVIRONMENT} ${APP_VERSION}" \
    --parameters "$(jq -nc --arg cmds "${launch_commands}" '{commands: [$cmds]}')" \
    --region "${AWS_REGION}" \
    --query "Command.CommandId" \
    --output text)

  echo "Launch command ID: ${launch_id}"
  local launch_status=""
  while [[ "${launch_status}" != "Success" && "${launch_status}" != "Failed" && "${launch_status}" != "Cancelled" ]]; do
    sleep 3
    launch_status=$(aws ssm get-command-invocation \
      --command-id "${launch_id}" --instance-id "${INSTANCE_ID}" --region "${AWS_REGION}" \
      --query "Status" --output text)
  done
  if [[ "${launch_status}" != "Success" ]]; then
    echo "Failed to launch background deploy (status=${launch_status})." >&2
    aws ssm get-command-invocation \
      --command-id "${launch_id}" --instance-id "${INSTANCE_ID}" --region "${AWS_REGION}" \
      --query "StandardErrorContent" --output text >&2
    return 1
  fi
  echo "Background deploy started. Polling for progress..."

  # ── Poll loop: ONE combined command per cycle — tails recent log lines AND
  # checks the completion marker, printed straight into this CI log so
  # progress is visible every cycle instead of only at the end. ─────────────
  local poll_commands
  poll_commands="tail -n 5 ${deploy_log} 2>/dev/null || echo '(log not written yet)'; echo '---'; cat ${done_marker} 2>/dev/null || true"

  local attempts=0
  local max_attempts=180   # 180 * ~12s ≈ 36 min cap
  local exit_code=""
  local started_at; started_at=$(date +%s)

  while [ "${attempts}" -lt "${max_attempts}" ]; do
    sleep 10
    attempts=$((attempts + 1))
    local elapsed=$(( $(date +%s) - started_at ))

    local poll_id
    poll_id=$(aws ssm send-command \
      --instance-ids "${INSTANCE_ID}" \
      --document-name "AWS-RunShellScript" \
      --comment "poll pupcon ${ENVIRONMENT} deploy" \
      --parameters "$(jq -nc --arg cmds "${poll_commands}" '{commands: [$cmds]}')" \
      --region "${AWS_REGION}" \
      --query "Command.CommandId" \
      --output text)
    sleep 2
    local poll_output
    poll_output=$(aws ssm get-command-invocation \
      --command-id "${poll_id}" --instance-id "${INSTANCE_ID}" --region "${AWS_REGION}" \
      --query "StandardOutputContent" --output text 2>/dev/null || echo "")

    echo "[${elapsed}s | poll ${attempts}/${max_attempts}]"
    echo "${poll_output}"

    exit_code=$(echo "${poll_output}" | grep -oE 'EXIT_CODE=[0-9]+' || true)
    if [ -n "${exit_code}" ]; then
      case "${exit_code}" in
        EXIT_CODE=0)
          echo "Deployment to ${ENVIRONMENT} completed successfully (${elapsed}s)"
          return 0
          ;;
        *)
          echo "Deploy script failed on instance (exit ${exit_code#EXIT_CODE=}) after ${elapsed}s." >&2
          return 1
          ;;
      esac
    fi
  done

  echo "Timed out after ${max_attempts} polls waiting for deploy to finish." >&2
  echo "Check ${deploy_log} on the instance for the full log." >&2
  return 1
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  deploy_via_ssm
fi
