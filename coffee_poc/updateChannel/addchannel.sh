#!/bin/sh
# set env variables in root directory where bin resides
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=${PWD}/../config

# configtxgen -channelID mychannel -outputCreateChannelTx mychannel.tx -profile NewChannelProfile

createChannelTx(){
    echo "################ Building NewChannel Tx ######################"
    configtxgen -profile NewChannelProfile -outputCreateChannelTx ../channel-artifacts/new-channel.tx -channelID new-channel
    sleep 5
}

createNewChannel(){
    echo "################### Creating New-Channel #######################"
    sudo docker exec -it cli-manufacturer-1 peer channel create -o orderer1.gov.io:7050 -c new-channel -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/new-channel.tx --outputBlock /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/new-channel-genesis.block --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem

    sleep 10

    echo "################### Manufacturer Joining => New-Channel #######################"

    sudo docker exec -it cli-manufacturer-1 peer channel join -b /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/new-channel-genesis.block

    sleep 10

    echo "################### Manufacturer Peer Update #######################"

    sudo docker exec -it cli-manufacturer-1 peer channel update -o orderer1.gov.io:7050 --channelID new-channel -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/mfd-anchor-1.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem

    sleep 10

    echo "################### Retailer Joining => New-Channel #######################"

    sudo docker exec -it cli-retail-1 peer channel join -b /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/new-channel-genesis.block
    
    sleep 10

    echo "################### Retailer Peer Update #######################"

    sudo docker exec -it cli-retail-1 peer channel update -o orderer1.gov.io:7050 --channelID new-channel -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/rtlr-anchor-1.tx.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem

    sleep 10
}

createChannelTx
createNewChannel