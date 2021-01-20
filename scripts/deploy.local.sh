#!/bin/bash -eu

echo Install
# run: npm ci

echo Test
npm run affected:test -- --base=origin/main --detectOpenHandles

echo Build
npm run affected:build -- --prod --base=origin/main --with-deps
