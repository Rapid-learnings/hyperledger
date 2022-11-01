#!/bin/sh

peer chaincode invoke -o orderer.poc.com:7050 --channelID pm-channel --name pmcc --tls true --cafile ${TLS_ROOT_CA} --isInit \
--peerAddresses peer0.gov.poc.com:15051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/gov.poc.com/peers/peer0.gov.poc.com/tls/ca.crt \
--peerAddresses peer0.producer.poc.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/producer.poc.com/peers/peer0.producer.poc.com/tls/ca.crt \
--peerAddresses peer0.manufacturer.poc.com:9051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.poc.com/peers/peer0.manufacturer.poc.com/tls/ca.crt \
-c '{"function":"initialize","Args":[]}'