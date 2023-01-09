#!/bin/sh

export PATH=${PWD}/bin:$PATH
export FABRIC_CFG_PATH=${PWD}/addOrg

jq ".data.data[0].payload.data.config" /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/config_block.json > /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/config.json


# appending org-3 definition in channel application fields
jq -s '.[0] * {"channel_group":{"groups":{"Application":{"groups": {"fssaiMSP":.[1]}}}}}' /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/config.json /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/safety.io/org3.json > /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/modified_config.json

# convert config.json to .pb
configtxlator proto_encode --input /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/config.json --type common.Config --output /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/config.pb

# convert modified-config.json to .pb
configtxlator proto_encode --input /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/modified_config.json --type common.Config --output /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/modified_config.pb

# calculate changes in the above two files
configtxlator compute_update --channel_id mfd-prd-channel --original /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/config.pb --updated /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/modified_config.pb --output /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/org3_update.pb

configtxlator proto_decode --input /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/org3_update.pb --type common.ConfigUpdate --output /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/org3_update.json

echo '{"payload":{"header":{"channel_header":{"channel_id":"'mfd-prd-channel'", "type":2}},"data":{"config_update":'$(cat /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/org3_update.json)'}}}' | jq . > /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/org3_update_in_envelope.json

configtxlator proto_encode --input /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/org3_update_in_envelope.json --type common.Envelope --output /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/org3_update_in_envelope.pb

