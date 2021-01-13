#!/bin/bash

echo Install
# run: npm ci

echo Test
npm run affected:test -- --base=origin/main

echo Build
npm run affected:build -- --prod --base=origin/main
