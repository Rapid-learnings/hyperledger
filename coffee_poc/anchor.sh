#!/bin/sh

echo 'Fetching channel config'
peer channel fetch config config_block.pb -c $1 -o orderer1.gov.io:7050 --tls --cafile $5

echo 'Convert channel config to json by scoping'
configtxlator proto_decode --input config_block.pb --type common.Block | jq .data.data[0].payload.data.config > config.json

echo 'Adding the anchor peer info into the config'

jq --arg PEERID $2 --arg PORT $4 '.channel_group.groups.Application.groups.'$3'.values.AnchorPeers.value.anchor_peers += [{"host": $PEERID,"port": $PORT}]' config.json > modified_anchor_config.json

echo 'Converting the config and modified config into pb'
configtxlator proto_encode --input config.json --type common.Config --output config.pb
configtxlator proto_encode --input modified_anchor_config.json --type common.Config --output modified_anchor_config.pb

echo 'Calculating delta between two files'
configtxlator compute_update --channel_id $1 --original config.pb --updated modified_anchor_config.pb --output anchor_update.pb

echo 'Converting update to json'
configtxlator proto_decode --input anchor_update.pb --type common.ConfigUpdate | jq . > anchor_update.json

chmod 755 anchor_update.json

echo 'Wrapping the json update in the envelope'
echo '{"payload":{"header":{"channel_header": {"channel_id":"'$1'", "type":2}},"data":{"config_update":'$(cat anchor_update.json)'}}}' > anchor_update_in_envelope.json

echo 'Converting wrapped update into pb'
configtxlator proto_encode --input anchor_update_in_envelope.json --type common.Envelope --output ./channel-artifacts/anchor_update_in_envelope.pb