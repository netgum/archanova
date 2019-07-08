#!/usr/bin/env bash

ROOT_DIR=$(dirname $0)

cd "${ROOT_DIR}/.."
ROOT_DIR=$(pwd)

ACTION="help"
ENV=""

for i in "$@"
do
case ${i} in
    kovan)
    ACTION="deploy"
    ENV="kovan"
    ;;
    rinkeby)
    ACTION="deploy"
    ENV="rinkeby"
    ;;
    ropsten)
    ACTION="deploy"
    ENV="ropsten"
    ;;
    sokol)
    ACTION="deploy"
    ENV="sokol"
    ;;
esac
done

deploy_dist() {
  aws s3 sync ./build-${ENV} s3://archanova-${ENV}-playground
}

case ${ACTION} in
    deploy)
    deploy_dist
    ;;
    help)
    echo "usage: ./deploy.sh [kovan|rinkeby|ropsten|sokol]"
    ;;
esac
