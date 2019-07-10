#!/usr/bin/env bash

ROOT_DIR=$(dirname $0)

cd "${ROOT_DIR}/.."

aws s3 sync ./build s3://archanova-playground
