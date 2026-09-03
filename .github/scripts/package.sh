#!/usr/bin/env bash
set -euo pipefail

GHCR_USER="${GHCR_USER:-$GITHUB_ACTOR}"
GHCR_TOKEN="${GHCR_TOKEN:-$GITHUB_TOKEN}"
GHCR_REGISTRY="ghcr.io"
IMAGE_NAMESPACE="zero-index-developers/pupcon"
API_IMAGE="$GHCR_REGISTRY/$IMAGE_NAMESPACE/pupcon-api"
CLIENT_IMAGE="$GHCR_REGISTRY/$IMAGE_NAMESPACE/pupcon-client"

if [ -z "${APP_VERSION:-}" ]; then
  echo "ERROR: APP_VERSION is not set."
  exit 1
fi

echo "Logging in to GHCR as $GHCR_USER..."
echo "$GHCR_TOKEN" | docker login "$GHCR_REGISTRY" -u "$GHCR_USER" --password-stdin

echo "Building images for $ENVIRONMENT using $COMPOSE_FILE..."
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" build

for IMAGE in "$API_IMAGE" "$CLIENT_IMAGE"; do
  if [ -z "$(docker images -q "$IMAGE" 2>/dev/null)" ]; then
    echo "ERROR: $IMAGE was not built. Check the image: fields in $COMPOSE_FILE."
    exit 1
  fi
  echo "Tagging $IMAGE:$APP_VERSION"
  docker tag "$IMAGE" "$IMAGE:$APP_VERSION"
done

echo "Pushing latest images..."
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" push

echo "Pushing versioned images ($APP_VERSION)..."
docker push "$API_IMAGE:$APP_VERSION"
docker push "$CLIENT_IMAGE:$APP_VERSION"

echo "Done packaging $APP_VERSION for $ENVIRONMENT"