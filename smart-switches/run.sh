#!/usr/bin/with-contenv bashio

export PATH="/usr/local/go/bin:$PATH"

env

go version

SERVER_PORT=8000

echo "Starting server on ${SERVER_PORT}"

python3 -m http.server "$SERVER_PORT"
