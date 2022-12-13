#!/bin/sh

docker run -it --network host  --env-file=./env \
  -e "CONFIG=$(cat ./lfx.rushstack.io-config.json|jq -r tostring)" typesense/docsearch-scraper
