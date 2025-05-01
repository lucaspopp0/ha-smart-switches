#!/usr/bin/with-contenv bashio

set -x

SWITCHES_JSON=/data/switches.json
SITE_DIR=/smartswitches/site

if [[ ! -f "$SWITCHES_JSON" ]]; then
    echo "{}" > "$SWITCHES_JSON"
fi

echo "Running image: $IMAGE_NAME"

/smartswitches/server/server
