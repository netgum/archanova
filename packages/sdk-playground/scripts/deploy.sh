#!/usr/bin/env bash

ROOT_DIR=$(dirname $0)

cd "${ROOT_DIR}/.."

aws s3 sync ./build s3://archanova-playground
aws cloudfront create-invalidation --distribution-id E101MSN0MKTQD4 --paths "/*"
