peer channel fetch config config_block.pb -c $1 -o orderer1.gov.io:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem

configtxlator proto_decode --input config_block.pb --type common.Block | jq .data.data[0].payload.data.config > config.json

jq ".channel_group.groups.Application.groups.$2.values.AnchorPeers.value.anchor_peers" config.json 

