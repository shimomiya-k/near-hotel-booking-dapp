#!/bin/sh

./build.sh

if [ $? -ne 0 ]; then
  echo ">> Error building contract"
  exit 1
fi

echo ">> Deploying contract"

# https://docs.near.org/tools/near-cli#near-dev-deploy
near dev-deploy --wasmFile ./target/wasm32-unknown-unknown/release/hotel_booking.wasm
# near deploy --accountId $SUB_ACCOUNT_NAME.$MY_CONTRACT_NAME --wasmFile ./target/wasm32-unknown-unknown/release/hotel_booking.wasm
