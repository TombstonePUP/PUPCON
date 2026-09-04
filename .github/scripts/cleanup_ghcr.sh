#!/usr/bin/env bash
set -euo pipefail

KEEP="${KEEP:-3}"
GHCR_ORG="${GHCR_ORG:-zero-index-developers}"
GHCR_PACKAGES="${GHCR_PACKAGES:-pupcon-api pupcon-client}"

for PACKAGE in $GHCR_PACKAGES; do
  echo "=== Cleaning up $PACKAGE ==="

  VERSIONS=$(gh api \
    -H "Accept: application/vnd.github+json" \
    "/orgs/$GHCR_ORG/packages/container/$PACKAGE/versions?per_page=100" \
    --jq '. | sort_by(.created_at) | reverse | .[].id')

  VERSION_ARRAY=($VERSIONS)
  TOTAL=${#VERSION_ARRAY[@]}

  echo "Found $TOTAL versions"

  if [ "$TOTAL" -le "$KEEP" ]; then
    echo "Nothing to clean ($TOTAL <= $KEEP)"
    continue
  fi

  DELETE_COUNT=$((TOTAL - KEEP))
  echo "Deleting $DELETE_COUNT old versions..."

  for ((i=KEEP; i<TOTAL; i++)); do
    VERSION_ID=${VERSION_ARRAY[$i]}
    gh api --method DELETE \
      "/orgs/$GHCR_ORG/packages/container/$PACKAGE/versions/$VERSION_ID" \
      || echo "Warning: Could not delete $VERSION_ID (may be in use)"
  done

  echo "Done: $PACKAGE"
done
