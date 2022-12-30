#!/bin/sh

export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=${PWD}/../config

if [ $1 == 1 ]; then
    echo "################ 1 ###############"
    jq .data.data[0].payload.data.config mfd-prd-config.json > mp-config.json
fi

if [ $1 == 2 ]; then
    echo "################ 2 ###############"
    jq -s '.[0] * {"channel_group":{"groups":{"Orderer": {"values": {"Capabilities": .[1].orderer}}}}}' mp-config.json ./scripts/capabilities.json > modified-mp-config.json
    # jq -s '.[0] * {"channel_group":{"values": {"Capabilities": .[1].channel}}}' mp-config.json ./scripts/capabilities.json > modified-mp-config.json
fi

if [ $1 == 3 ]; then
    echo "################ 3 ###############"
    export CH_NAME=mfd-prd-channel
    
    configtxlator proto_decode --input config-mp-update.pb --type common.ConfigUpdate --output config-mp-update.json

    echo '{"payload":{"header":{"channel_header":{"channel_id":"'$CH_NAME'", "type":2}},"data":{"config_update":'$(cat config-mp-update.json)'}}}' | jq . > config_update_in_envelope.json

    configtxlator proto_encode --input config_update_in_envelope.json --type common.Envelope --output ./channel-artifacts/config_update_in_envelope.pb
fi