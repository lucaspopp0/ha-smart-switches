#!/usr/bin/with-contenv bashio

set -x

export PATH="/usr/local/go/bin:$PATH"

SWITCHES_JSON=/data/switches.json
SITE_DIR=/smartswitches/site

go mod download
go run /smartswitches/server/main.go
