#!/bin/sh

export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=${PWD}/../config

if [ $1 == 1 ]; then
    echo "################ 1 ###############"
    jq .data.data[0].payload.data.config config_block.json > config.json
fi

if [ $1 == 2 ]; then
    echo "################ 2 ###############"
    jq -s '.[0] * {"channel_group":{"groups":{"Orderer": {"values": {"Capabilities": .[1].orderer}}}}}' config.json ./scripts/capabilities.json > modified_config.json
    # jq -s '.[0] * {"channel_group":{"values": {"Capabilities": .[1].channel}}}' mp-config.json ./scripts/capabilities.json > modified-mp-config.json
fi

if [ $1 == 3 ]; then
    echo "################ 3 ###############"
    export CH_NAME=orderer-channel
    
    configtxlator proto_decode --input config_update.pb --type common.ConfigUpdate --output config_update.json

    echo '{"payload":{"header":{"channel_header":{"channel_id":"'$CH_NAME'", "type":2}},"data":{"config_update":'$(cat config_update.json)'}}}' | jq . > config_update_in_envelope.json

    configtxlator proto_encode --input config_update_in_envelope.json --type common.Envelope --output ./channel-artifacts/config_update_in_envelope.pb
fi

if [ $1 == 4 ]; then
    echo "################ 4 ###############"
    jq .data.data[0].payload.data.config config_block.json > config.json
    
    jq -s '.[0] * {"channel_group":{"values": {"Capabilities": .[1].channel}}}' config.json ./scripts/capabilities.json > modified_config.json
    
    configtxlator proto_encode --input config.json --type common.Config --output config.pb

    configtxlator proto_encode --input modified_config.json --type common.Config --output modified_config.pb

    configtxlator compute_update --channel_id orderer-channel --original config.pb --updated modified_config.pb --output config_update.pb

    configtxlator proto_decode --input config_update.pb --type common.ConfigUpdate --output config_update.json

    echo '{"payload":{"header":{"channel_header":{"channel_id":"'$CH_NAME'", "type":2}},"data":{"config_update":'$(cat config_update.json)'}}}' | jq . > config_update_in_envelope.json

    configtxlator proto_encode --input config_update_in_envelope.json --type common.Envelope --output config_update_in_envelope.pb

    peer channel update -f config_update_in_envelope.pb -c $CH_NAME -o orderer1.gov.io:7050 --tls true --cafile $ORDERER_CA
fi