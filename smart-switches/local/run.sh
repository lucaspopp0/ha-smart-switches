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

SWITCHES_JSON=/data/switches.json
SITE_DIR=/smartswitches/site

if [[ ! -f "$SWITCHES_JSON" ]]; then
    echo "{}" > "$SWITCHES_JSON"
fi

/smartswitches/server/server
