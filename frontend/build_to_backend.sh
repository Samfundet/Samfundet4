#!/bin/bash

set -eu

yarn build --mode development
rm -rf ../backend/reactapp
mv dist ../backend/reactapp

echo "Done!"
