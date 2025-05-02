#!/bin/bash

set -e

docker build \
    -t ha-smart-switches-server \
    -f local/Dockerfile \
    .
