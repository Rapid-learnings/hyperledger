#!/bin/sh

export CORE_PEER_LOCALMSPID=ProducerMSP
export CORE_PEER_ADDRESS=peer0.producer.poc.com:7051
export CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/producer.poc.com/peers/peer0.producer.poc.com/tls/server.crt
export CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/producer.poc.com/peers/peer0.producer.poc.com/tls/server.key
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/producer.poc.com/peers/peer0.producer.poc.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/producer.poc.com/users/Admin@producer.poc.com/msp

