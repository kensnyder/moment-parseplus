#!/usr/bin/env bash

path="$(dirname "$(which node)")"/../lib/node_modules/full-icu
if [ ! -d "$path" ]
then
  echo "Attempting to globally install full-icu with npm for i18n tests..."
  echo "npm install -g full-icu"
  npm install -g full-icu
fi

if [ -d "$path" ]
then
  export NODE_ICU_DATA="$path"
fi

if [ -n "$NODE_ICU_DATA" ]
then
  TZ=UTC npx jest "$@"
else
  RED='\033[0;31m'
  WHITE='\033[0m'
  echo "${RED}We failed to find the full-icu package npm install has failed."
  echo "You need to:"
  echo "  1. Globally install i18n data using npm:"
  echo "     npm install -g full-icu"
  echo "  2. Export an environmental variable with the full-icu data path."
  echo "     If your global node_modules folder was at /usr/lib/node_modules/full-icu"
  echo "     then you would run:"
  echo "     export NODE_ICU_DATA=/usr/lib/node_modules/full-icu"
  echo "${WHITE}"
  echo "Then you should be able to run 'npm test' again.";
  echo ""
fi
