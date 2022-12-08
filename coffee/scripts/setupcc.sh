#!/bin/sh

cd chaincode

peer lifecycle chaincode package pmcc.tar.gz --lang node --label pmcc_1 --path $PWD

cd ..

peer lifecycle chaincode install ./chaincode/pmcc.tar.gz

peer lifecycle chaincode queryinstalled >&log.txt

export PACKAGE_ID=$(cat log.txt | grep "Package" | cut -d " " -f 3 | cut -d "," -f 1)

peer lifecycle chaincode approveformyorg -o orderer.poc.com:7050 --channelID pm-channel --name pmcc --version 1 --sequence 1 --init-required --tls true --cafile ${TLS_ROOT_CA} --package-id $PACKAGE_ID

export CORE_PEER_LOCALMSPID=ManufacturerMSP
export CORE_PEER_ADDRESS=peer0.manufacturer.poc.com:9051
export CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.poc.com/peers/peer0.manufacturer.poc.com/tls/server.crt
export CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.poc.com/peers/peer0.manufacturer.poc.com/tls/server.key
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.poc.com/peers/peer0.manufacturer.poc.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.poc.com/users/Admin@manufacturer.poc.com/msp

peer lifecycle chaincode install ./chaincode/pmcc.tar.gz

peer lifecycle chaincode approveformyorg -o orderer.poc.com:7050 --channelID pm-channel --name pmcc --version 1 --sequence 1 --init-required --tls true --cafile ${TLS_ROOT_CA} --package-id $PACKAGE_ID

export CORE_PEER_LOCALMSPID=GovMSP
export CORE_PEER_ADDRESS=peer0.gov.poc.com:15051
export CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/gov.poc.com/peers/peer0.gov.poc.com/tls/server.crt
export CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/gov.poc.com/peers/peer0.gov.poc.com/tls/server.key
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/gov.poc.com/peers/peer0.gov.poc.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/gov.poc.com/users/Admin@gov.poc.com/msp

peer lifecycle chaincode install ./chaincode/pmcc.tar.gz

peer lifecycle chaincode approveformyorg -o orderer.poc.com:7050 --channelID pm-channel --name pmcc --version 1 --sequence 1 --init-required --tls true --cafile ${TLS_ROOT_CA} --package-id $PACKAGE_ID

peer lifecycle chaincode checkcommitreadiness --channelID pm-channel --version 1 --sequence 1 --name pmcc --output json --init-required

peer lifecycle chaincode commit -o orderer.poc.com:7050 --channelID pm-channel --name pmcc --version 1 --sequence 1 --init-required --tls true --cafile ${TLS_ROOT_CA} \
--peerAddresses peer0.gov.poc.com:15051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/gov.poc.com/peers/peer0.gov.poc.com/tls/ca.crt \
--peerAddresses peer0.producer.poc.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/producer.poc.com/peers/peer0.producer.poc.com/tls/ca.crt \
--peerAddresses peer0.manufacturer.poc.com:9051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.poc.com/peers/peer0.manufacturer.poc.com/tls/ca.crt 

peer lifecycle chaincode querycommitted --channelID pm-channel --name pmcc

export CORE_PEER_LOCALMSPID=ProducerMSP
export CORE_PEER_ADDRESS=peer0.producer.poc.com:7051
export CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/producer.poc.com/peers/peer0.producer.poc.com/tls/server.crt
export CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/producer.poc.com/peers/peer0.producer.poc.com/tls/server.key
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/producer.poc.com/peers/peer0.producer.poc.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/producer.poc.com/users/Admin@producer.poc.com/msp



