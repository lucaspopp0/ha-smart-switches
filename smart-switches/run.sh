#!/usr/bin/with-contenv bashio

env

SERVER_PORT=8000

echo "Starting server on ${SERVER_PORT}"

python3 -m http.server "$SERVER_PORT"
