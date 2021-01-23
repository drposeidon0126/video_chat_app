#!/bin/bash -eu

echo Serve
nx run-many --target serve --projects crane,peek --maxParallel 2 --parallel
