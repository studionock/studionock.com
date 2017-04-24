#!/bin/bash
set -e

ENV=$1

cp now.${ENV}.json dist/now.json
cd dist/

now -t ${NOW_TOKEN}
now alias -t ${NOW_TOKEN}
