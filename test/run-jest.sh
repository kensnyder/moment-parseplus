#!/usr/bin/env bash

# First ensure that full-icu data is available
modulesPath="$(dirname "$(which node)")"/../lib/node_modules
fullIcuPath="$modulesPath/full-icu"

if [ ! -d "$fullIcuPath" ]
then
  echo "Attempting to globally install full-icu with npm for i18n unit tests..."
  echo "npm install -g full-icu"
  npm install -g full-icu
fi

if [ -d "$fullIcuPath" ]
then
  export NODE_ICU_DATA="$fullIcuPath"
fi

if [ -n "$NODE_ICU_DATA" ]
then
  # make sure moment is available
  if ! npm list -g | grep -q 'moment'
  then
    echo "Attempting to globally install moment with npm for unit tests..."
    echo "npm install -g moment"
    npm install -g moment
  fi
  # make moment available
  export NODE_PATH=$modulesPath
  # set timezone to UTC and run tests
  TZ=UTC npx jest "$@"
else
  # Failed
  RED='\033[0;31m'
  WHITE='\033[0m'
  echo "${RED}We failed to find the full-icu package npm install has failed."
  echo "You need to:"
  echo "  1. Globally install i18n data using npm:"
  echo "     npm install -g full-icu"
  echo "  2. Export an environmental variable with the path to the full-icu directory."
  echo "     If your global node_modules folder was at /usr/lib/node_modules/full-icu"
  echo "     then you would run:"
  echo "     export NODE_ICU_DATA=/usr/lib/node_modules/full-icu"
  echo "${WHITE}"
  echo "Then you should be able to run 'npm test' again.";
  echo ""
fi
