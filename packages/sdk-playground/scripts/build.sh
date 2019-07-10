#!/usr/bin/env bash

ROOT_DIR=$(dirname $0)

cd "${ROOT_DIR}/.."

export REACT_APP_ACTIVATE_HELP=0
export REACT_APP_ACTIVATE_MAIN_SDK_ENV=0
export REACT_APP_ACTIVATE_LOCAL_SDK_ENV=0
export REACT_APP_ACTIVATE_XDAI_SDK_ENV=0
export REACT_APP_AUTO_INITIALIZE_SDK=1
export REACT_APP_AUTO_ACCEPT_SDK_ACTIONS=1

rm -r -f ./build
./node_modules/.bin/react-scripts build
