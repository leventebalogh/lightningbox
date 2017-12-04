#!/usr/bin/env bash

# This script uses the Node Docker image to:
# 1. pull the latest changes
# 2. update the NPM dependencies
# 4. build the site

# How to run
# ./scripts/build.sh

function abspath() {
    if [ -d "$1" ]; then
        # dir
        (cd "$1"; pwd)
    elif [ -f "$1" ]; then
        # file
        if [[ $1 == */* ]]; then
            echo "$(cd "${1%/*}"; pwd)/${1##*/}"
        else
            echo "$(pwd)/$1"
        fi
    fi
}

# The site directory
ROOT=$(abspath "${BASH_SOURCE%/*}/..")

# Pull
git checkout master
git pull

# Build
docker run \
    -it \
    --rm \
    --name node \
    -v $ROOT:/var/www \
    node:8 \
    /bin/bash -c "cd /var/www && yarn && yarn build"
