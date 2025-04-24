#!/usr/bin/with-contenv bashio

set -x

export PATH="/usr/local/go/bin:$PATH"

SWITCHES_JSON=/data/switches.json
SITE_DIR=/smartswitches/site

cd /smartswitches/server

go get ./...
go run main.go
