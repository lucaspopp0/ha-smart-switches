#!/usr/bin/with-contenv bashio

set -x

export PATH="/usr/local/go/bin:$PATH"

env

SERVER_PORT=8000

echo "Starting server on ${SERVER_PORT}"

curl \
  -s \
  -X GET \
  -H "Authorization: Bearer ${SUPERVISOR_TOKEN}" \
  -H "Content-Type: application/json" \
  http://supervisor/core/api/states \
  | jq 'map(.entity_id) | map(select(test("(automation|script|scene)\\..+")))'
