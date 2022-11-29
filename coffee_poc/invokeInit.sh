#!/bin/sh
# ./invokeInit.sh

echo "===== Instantiating mfcprd CC on manufacturer peer-1 ====="
sudo docker exec -it cli-manufacturer-1 peer chaincode invoke -o orderer1.gov.io:7050 --channelID mfd-prd-channel --name mfcprd --isInit --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peertf1.production.com:7051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/production.com/peers/peertf1.production.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt" -c '{"function":"init","Args":["1000"]}'

echo "===== Instantiating mw CC on manufacturer peer-1 ====="
sudo docker exec -it cli-manufacturer-1 peer chaincode invoke -o orderer1.gov.io:7050 --channelID mfd-whs-channel --name mw --isInit --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peerts1.wharehouse.com:11051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt" -c '{"function":"initialize","Args":[]}'

echo "===== Instantiating wr CC on manufacturer peer-1 ====="
sudo docker exec -it cli-wharehouse-1 peer chaincode invoke -o orderer1.gov.io:7050 --channelID whs-rtlr-channel --name wr --isInit --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peerts1.wharehouse.com:11051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" --peerAddresses peerbb1.retailer.com:13051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/retailer.com/peers/peerbb1.retailer.com/tls/ca.crt" -c '{"function":"initialize","Args":[]}'