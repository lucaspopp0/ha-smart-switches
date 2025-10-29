#!/usr/bin/bash

if [[ -f /data/.env ]]; then
    source /data/.env

    if [[ -n "$SUPERVISOR_HOST" ]]; then
        export SUPERVISOR_HOST
    fi

    if [[ -n "$SUPERVISOR_TOKEN" ]]; then
        export SUPERVISOR_TOKEN
    fi
fi

SWITCHES_JSON=/data/switches_v2.json
SITE_DIR=/smartswitches/site

if [[ ! -f "$SWITCHES_JSON" ]]; then
    echo '{"switches":{}}' > "$SWITCHES_JSON"
fi

# Check if we should run with debugger
if [[ "$DEBUG" == "true" ]]; then
    echo "Starting with Delve debugger on port 2345..."
    dlv exec /smartswitches/server/server \
        --headless \
        --listen=:2345 \
        --api-version=2 \
        --accept-multiclient \
        --log
else
    /smartswitches/server/server
fi
