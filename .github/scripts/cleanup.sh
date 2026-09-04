#!/usr/bin/env bash
set -e

AUTH_TOKEN="${GH_PAT:-$GITHUB_TOKEN}"

FILTER_REGEX=$(echo "$FILTER_TAGS" | sed 's/\*/.+/g; s/^/^/; s/$/$/')
SKIP_REGEX=$(echo "$SKIP_TAGS" | sed 's/\*/.+/g; s/^/^/; s/$/$/')

echo "Filter regex: $FILTER_REGEX"
echo "Skip regex:   $SKIP_REGEX"

for PACKAGE_NAME in $(echo "$PACKAGES" | tr ',' ' '); do
  ENCODED_PACKAGE=$(echo "$PACKAGE_NAME" | sed 's|/|%2F|g')

  echo ""
  echo "=== Cleaning up $PACKAGE_NAME ==="

  VERSIONS=$(curl -s \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com/orgs/$OWNER/packages/container/$ENCODED_PACKAGE/versions?per_page=100")

  if ! echo "$VERSIONS" | jq -e 'if type == "array" then true else error end' > /dev/null 2>&1; then
    echo "API Error: $(echo "$VERSIONS" | jq -r '.message // "Unknown error"')"
    continue
  fi

  TOTAL=$(echo "$VERSIONS" | jq 'length')
  echo "Total versions fetched: $TOTAL"

  MATCHED=$(echo "$VERSIONS" | jq --arg filter "$FILTER_REGEX" --arg skip "$SKIP_REGEX" '
    [
      .[] |
      (.metadata.container.tags // []) as $tags |
      select($tags | length > 0) |
      select($tags | map(test($filter)) | any) |
      select(
        ($skip == "") or
        ($tags | map(test($skip)) | any | not)
      ) |
      { id: .id, tags: $tags, created_at: .created_at }
    ] |
    sort_by(.created_at) | reverse
  ')

  MATCHED_COUNT=$(echo "$MATCHED" | jq 'length')
  echo "Matched tagged versions: $MATCHED_COUNT"

  TO_DELETE=$(echo "$MATCHED" | jq --argjson keep "$KEEP" '.[$keep:]')
  DELETE_COUNT=$(echo "$TO_DELETE" | jq 'length')

  echo "Versions to delete: $DELETE_COUNT"

  if [ "$DELETE_COUNT" -gt 0 ]; then
    echo "$TO_DELETE" | jq -r '.[] | "  \(.tags) (\(.created_at))"'

    echo "$TO_DELETE" | jq -r '.[].id' | while read -r VERSION_ID; do
      RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
        -X DELETE \
        -H "Authorization: Bearer $AUTH_TOKEN" \
        -H "Accept: application/vnd.github+json" \
        "https://api.github.com/orgs/$OWNER/packages/container/$ENCODED_PACKAGE/versions/$VERSION_ID")

      if [ "$RESPONSE" = "204" ]; then
        echo "  Deleted version $VERSION_ID"
      else
        echo "  Failed to delete version $VERSION_ID (HTTP $RESPONSE)"
      fi
    done
  else
    echo "Nothing to delete, skipping"
  fi
done

echo ""
echo "Cleanup complete"
