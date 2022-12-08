#!/bin/sh

export CORE_PEER_LOCALMSPID=GovMSP
export CORE_PEER_ADDRESS=peer0.gov.poc.com:15051
export CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/gov.poc.com/peers/peer0.gov.poc.com/tls/server.crt
export CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/gov.poc.com/peers/peer0.gov.poc.com/tls/server.key
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/gov.poc.com/peers/peer0.gov.poc.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/gov.poc.com/users/Admin@gov.poc.com/msp

