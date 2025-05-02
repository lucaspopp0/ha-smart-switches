#!/usr/bin/bash

set -x

SWITCHES_JSON=/data/switches.json
SITE_DIR=/smartswitches/site

echo '{"switches":{}}' > "$SWITCHES_JSON"

/smartswitches/server/server
