#!/bin/sh

#create PMC channel
peer channel create -o orderer.poc.com:7050 --channelID pm-channel -f ./channel-artifacts/pm-channel.tx --tls --cafile ${TLS_ROOT_CA} --outputBlock ./channel-artifacts/pm-channel.block
#join peer0 producer
peer channel join -b ./channel-artifacts/pm-channel.block
# update anchor peer for producer msp
peer channel update -o orderer.poc.com:7050 --channelID pm-channel -f ./channel-artifacts/ProducerMSP_pm_anchor.tx --tls --cafile ${TLS_ROOT_CA}
# set globals for manufacturer
export CORE_PEER_LOCALMSPID=ManufacturerMSP
export CORE_PEER_ADDRESS=peer0.manufacturer.poc.com:9051
export CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.poc.com/peers/peer0.manufacturer.poc.com/tls/server.crt
export CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.poc.com/peers/peer0.manufacturer.poc.com/tls/server.key
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.poc.com/peers/peer0.manufacturer.poc.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.poc.com/users/Admin@manufacturer.poc.com/msp
# join PMC peer0 manufacturer
peer channel join -b ./channel-artifacts/pm-channel.block
#update anchor peer for manufacturer
peer channel update -o orderer.poc.com:7050 --channelID pm-channel -f ./channel-artifacts/ManufacturerMSP_pm_anchor.tx --tls --cafile ${TLS_ROOT_CA}
#create MWC channel
peer channel create -o orderer.poc.com:7050 -f ./channel-artifacts/mw-channel.tx --channelID mw-channel --tls --cafile ${TLS_ROOT_CA} --outputBlock ./channel-artifacts/mw-channel.block
#join MWC peer0 manufacturer
peer channel join -b ./channel-artifacts/mw-channel.block
#update anchor peer for manufacturerb
peer channel update -o orderer.poc.com:7050 --channelID mw-channel -f ./channel-artifacts/ManufacturerMSP_mw_anchor.tx --tls --cafile ${TLS_ROOT_CA}
#set globals for warehouse
export CORE_PEER_LOCALMSPID=WarehouseMSP
export CORE_PEER_ADDRESS=peer0.warehouse.poc.com:11051
export CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/warehouse.poc.com/peers/peer0.warehouse.poc.com/tls/server.crt
export CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/warehouse.poc.com/peers/peer0.warehouse.poc.com/tls/server.key
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/warehouse.poc.com/peers/peer0.warehouse.poc.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/warehouse.poc.com/users/Admin@warehouse.poc.com/msp
#join MWC peer0 warehouse 
peer channel join -b ./channel-artifacts/mw-channel.block
#update anchor peer for warehouse
peer channel update -o orderer.poc.com:7050 -f ./channel-artifacts/WarehouseMSP_mw_anchor.tx --tls --cafile ${TLS_ROOT_CA} --channelID mw-channel
#ceate WRC channel
peer channel create -o orderer.poc.com:7050 -f ./channel-artifacts/wr-channel.tx --outputBlock ./channel-artifacts/wr-channel.block --tls --cafile ${TLS_ROOT_CA} --channelID wr-channel
#join WRC peer0 warehouse
peer channel join -b ./channel-artifacts/wr-channel.block
#update anchor peer for warehouse
peer channel update -o orderer.poc.com:7050 -f ./channel-artifacts/WarehouseMSP_wr_anchor.tx --tls --cafile ${TLS_ROOT_CA} --channelID wr-channel
#set globals for retailer
export CORE_PEER_LOCALMSPID=RetailerMSP
export CORE_PEER_ADDRESS=peer0.retailer.poc.com:13051
export CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/retailer.poc.com/peers/peer0.retailer.poc.com/tls/server.crt
export CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/retailer.poc.com/peers/peer0.retailer.poc.com/tls/server.key
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/retailer.poc.com/peers/peer0.retailer.poc.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/retailer.poc.com/users/Admin@retailer.poc.com/msp
#join WRC peer0 retailer
peer channel join -b ./channel-artifacts/wr-channel.block
#update anchor peer for retailer
peer channel update -o orderer.poc.com:7050 -f ./channel-artifacts/RetailerMSP_wr_anchor.tx --channelID wr-channel --tls --cafile ${TLS_ROOT_CA}
#set globals for gov
export CORE_PEER_LOCALMSPID=GovMSP
export CORE_PEER_ADDRESS=peer0.gov.poc.com:15051
export CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/gov.poc.com/peers/peer0.gov.poc.com/tls/server.crt
export CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/gov.poc.com/peers/peer0.gov.poc.com/tls/server.key
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/gov.poc.com/peers/peer0.gov.poc.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/gov.poc.com/users/Admin@gov.poc.com/msp
#join PMC peer0 gov
peer channel join -b ./channel-artifacts/pm-channel.block
#update anchor peer for gov in PMC
peer channel update -o orderer.poc.com:7050 --channelID pm-channel -f ./channel-artifacts/GovMSP_pm_anchor.tx --tls --cafile ${TLS_ROOT_CA}
#join MWC peer0 gov
peer channel join -b ./channel-artifacts/mw-channel.block
#update anchor peer for gov in MWC
peer channel update -o orderer.poc.com:7050 --channelID mw-channel -f ./channel-artifacts/GovMSP_mw_anchor.tx --tls --cafile ${TLS_ROOT_CA}
#join WRC peer0 gov
peer channel join -b ./channel-artifacts/wr-channel.block
#update anchor peer for gov in WRC
peer channel update -o orderer.poc.com:7050 --channelID wr-channel -f ./channel-artifacts/GovMSP_wr_anchor.tx --tls --cafile ${TLS_ROOT_CA}

export CORE_PEER_LOCALMSPID=ProducerMSP
export CORE_PEER_ADDRESS=peer0.producer.poc.com:7051
export CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/producer.poc.com/peers/peer0.producer.poc.com/tls/server.crt
export CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/producer.poc.com/peers/peer0.producer.poc.com/tls/server.key
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/producer.poc.com/peers/peer0.producer.poc.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/producer.poc.com/users/Admin@producer.poc.com/msp
