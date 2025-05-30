#!/bin/bash

set -e

if [[ -n "$VERSION_TAG" ]]; then
    echo "# ${VERSION_TAG}";
fi

if [[ -n "$COMMIT_MESSAGE" ]]; then
    first=true
    while IFS='' read -r line || [[ -n "$line" ]]; do
        if [[ "$first" == "true" ]]; then
            first=false
            echo " * $line"
        else
            echo "   $line"
        fi
    done <<< "$COMMIT_MESSAGE"

    echo ""
fi

git log HEAD~1...v1.0.5 --format=' * %h %s' \
    | sed -E 's/.*\[bot\] (.+)/\n# \1/' \
    | sed -E 's| \* ([a-z0-9]+) (.+)| * [`\1`](https://github.com/lucaspopp0/ha-smart-switches/commit/\1) \2|'
