#!/bin/sh

export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=${PWD}/../config

# update channel config for mfd-prd-channel

echo "############## update channel config for mfd-prd-channel ######################"

export CH_NAME=mfd-prd-channel
export ORDERER_CONTAINER=orderer1.gov.io:7050
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem
# export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt
export CORE_PEER_LOCALMSPID="OrdererMSP"

export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/users/Admin@gov.io/msp

export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem


echo ${CH_NAME}
echo ${ORDERER_CONTAINER}
echo ${CORE_PEER_TLS_ROOTCERT_FILE}
echo ${CORE_PEER_LOCALMSPID}
echo ${CORE_PEER_MSPCONFIGPATH}

# file would be stored in the container
sudo docker exec -it cli-manufacturer-1 peer channel fetch config mfd-prd-config.pb -o ${ORDERER_CONTAINER} -c ${CH_NAME} --tls --cafile ${ORDERER_CA}

# creating protobuf version to json
sudo docker exec -it cli-manufacturer-1 configtxlator proto_decode --input mfd-prd-config.pb --type common.Block --output mfd-prd-config.json

# transferring required info into another file
# sudo docker exec -it cli-manufacturer-1  touch mp-config.json
sudo docker exec -it cli-manufacturer-1 ./scripts/ops.sh 1

# should not directly change mp-config.json, it is required later
# creating copy of mp-config.json
sudo docker exec -it cli-manufacturer-1 cp mp-config.json modified-mp-config.json

sudo docker exec -it cli-manufacturer-1 ./scripts/ops.sh 2

# calculating changes 

sudo docker exec -it cli-manufacturer-1 configtxlator proto_encode --input mp-config.json --type common.Config --output mp-config.pb

sudo docker exec -it cli-manufacturer-1 configtxlator proto_encode --input modified-mp-config.json --type common.Config --output modified-mp-config.pb

sudo docker exec -it cli-manufacturer-1 configtxlator compute_update --channel_id $CH_NAME --original mp-config.pb --updated modified-mp-config.pb --output config-mp-update.pb

# applying changes

sudo docker exec -it cli-manufacturer-1 ./scripts/ops.sh 3

# Submit the config update transaction:
sudo docker exec -it cli-manufacturer-1 peer channel update -f ./channel-artifacts/config_update_in_envelope.pb -c $CH_NAME -o orderer1.gov.io:7050 --tls true --cafile $ORDERER_CA



# add env variables here
# export CORE_PEER_LOCALMSPID="tataMSP"
# export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt
# export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/users/Admin@manufacturer.com/msp
# export CORE_PEER_ADDRESS=peertm1.manufacturer.com:

# sudo docker exec -it cli-manufacturer-1 peer channel signconfigtx -f ./channel-artifacts/config_update_in_envelope.pb

# export CORE_PEER_LOCALMSPID="teafarmMSP"
# export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/production.com/peers/peertf1.production.com/tls/ca.crt
# export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/production.com/users/Admin@production.com/msp
# export CORE_PEER_ADDRESS=peertf1.production.com:

# sudo docker exec -it cli-production-1 peer channel signconfigtx -f ./channel-artifacts/config_update_in_envelope.pb

# # submit config update
# export CORE_ORDERER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem
# export CORE_PEER_LOCALMSPID="OrdererMSP"
# export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/users/Admin@gov.io/msp

# sudo docker exec -it cli-manufacturer-1 peer channel update -f ./channel-artifacts/config_update_in_envelope.pb -c $CH_NAME -o orderer1.gov.io:7050 --tls true --cafile $CORE_ORDERER_TLS_ROOTCERT_FILE