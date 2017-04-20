#!/bin/bash
set -e

ENV=$1

if [[ $ENV == 'staging' ]]; then
  now dist/ -t ${NOW_TOKEN} -c now.staging.json
else
  now dist/ -t ${NOW_TOKEN} -c now.json
fi
