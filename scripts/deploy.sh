#!/bin/bash
set -e

ENV=$1

cp now.${ENV}.json now.json

now -t ${NOW_TOKEN}
now alias -t ${NOW_TOKEN}
