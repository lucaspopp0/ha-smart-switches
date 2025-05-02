#!/bin/bash

set -e

IMAGE="${IMAGE_NAME}" \
    docker compose up -d

cd ../site

if [[ -f "$HOME/.nvm" ]]; then
    . "$HOME/.nvm/nvm.sh"
fi

npm run develop
