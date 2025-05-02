#!/usr/bin/with-contenv bashio

set -x

SWITCHES_JSON=/data/switches.json
SITE_DIR=/smartswitches/site

if [[ ! -d "/data" ]]; then
    mkdir /data
fi

if [[ ! -f "$SWITCHES_JSON" ]]; then
    echo "{}" > "$SWITCHES_JSON"
fi

/smartswitches/server/server
