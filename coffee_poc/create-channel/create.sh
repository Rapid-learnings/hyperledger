#!/bin/sh

export FABRIC_CFG_PATH=${PWD}/../config
export PATH=${PWD}/../bin:$PATH

VERSION='1'

echo "##########################################################"
echo "#### Creating Channel Between Manufacturer & Retailer ####"
echo "##########################################################"

# generate channel tx
echo 
echo "Generating Channel Tx"
configtxgen -profile CoffeeChannelProfile --outputCreateChannelTx ../channel-artifacts/mfd-rtlr-channel-5.tx -channelID mfd-rtlr-channel-5

sleep 8

# creating channels
echo 
echo "Creating channels"
sudo docker exec -it cli-manufacturer-1 peer channel create -o orderer1.gov.io:7050 -c mfd-rtlr-channel-5 -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/mfd-rtlr-channel-5.tx --outputBlock /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/mfd-rtlr-genesis.block --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem

sleep 8

echo "====== Joining channel by cli-manufacturer-1 ======"
sudo docker exec -it cli-manufacturer-1 peer channel join -b /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/mfd-rtlr-genesis.block

sleep 8

configtxgen -profile CoffeeChannelProfile -outputAnchorPeersUpdate ../channel-artifacts/mfd-anchor-3.tx -channelID mfd-rtlr-channel-5 -asOrg tata

sleep 8

echo
echo "Updating Manufacture Peer"
sudo docker exec -it cli-manufacturer-1 peer channel update -o orderer1.gov.io:7050 --channelID mfd-rtlr-channel-5 -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/mfd-anchor-3.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem

sleep 10

echo
echo "Joining channel rtlr-1"
sudo docker exec -it cli-retail-1 peer channel join -b /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/mfd-rtlr-genesis.block

sleep 10

configtxgen -profile CoffeeChannelProfile -outputAnchorPeersUpdate ../channel-artifacts/rtlr-anchor-3.tx -channelID mfd-rtlr-channel-5 -asOrg bigbazar

sleep 8

echo
echo "Updating Retailer Peer"
sudo docker exec -it cli-retail-1 peer channel update -o orderer1.gov.io:7050 --channelID mfd-rtlr-channel-5 -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/rtlr-anchor-3.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem

sleep 8

echo "********** Packaging CC for Manufacture-Production-Channel ********************"
    # sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode package fabcar.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/fabcar --lang node --label fabcar_1.0
sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode package fabcar.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/fabcar --lang node --label fabcar_mfd_${VERSION}

sleep 6

# sudo docker exec -it cli-retail-1 peer lifecycle chaincode package fabcar.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/fabcar --lang node --label fabcar_1.0
sudo docker exec -it cli-retail-1 peer lifecycle chaincode package fabcar.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/fabcar --lang node --label fabcar_rtlr_${VERSION}

sleep 6


echo "********* Installing CC for Manufacture-Production-Channel ************ "
sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode install /opt/gopath/src/github.com/hyperledger/fabric/peer/fabcar.tar.gz
    
sleep 6

sudo docker exec -it cli-retail-1 peer lifecycle chaincode install /opt/gopath/src/github.com/hyperledger/fabric/peer/fabcar.tar.gz

sleep 6

sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode queryinstalled > fabcar.txt 2>&1
cat fabcar.txt
    # CC_PACKAGE_ID=$(sed -n "/${CC_NAME}_${CC_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
export CC_PACKAGE_ID=$(cat fabcar.txt | grep "fabcar" | cut -d " " -f 3 | cut -d "," -f 1)
    #   export CC_PACKAGE_ID
sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode approveformyorg -o orderer1.gov.io:7050 --channelID mfd-rtlr-channel-5 --name fabcar --version ${VERSION} --package-id ${CC_PACKAGE_ID} --sequence ${VERSION} --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem"

sleep 5

sudo docker exec -it cli-retail-1 peer lifecycle chaincode approveformyorg -o orderer1.gov.io:7050 --channelID mfd-rtlr-channel-5 --name fabcar --version ${VERSION} --package-id ${CC_PACKAGE_ID} --sequence ${VERSION} --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem"

sleep 5

echo "Checking Commit Readiness for Channel mfd-prd-channel"
sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode checkcommitreadiness --channelID mfd-rtlr-channel-5 --name fabcar --version 1 --sequence ${VERSION} --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --output json

sleep 8

echo "******************** Making commit **********************"

sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode commit -o orderer1.gov.io:7050 --channelID mfd-rtlr-channel-5 --name fabcar --version 1 --sequence ${VERSION} --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peerbb1.retailer.com:11051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/retailer.com/peers/peerbb1.retailer.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt"

sleep 8

echo "****** Invoking ChainCode On Mfc-Prd-Channel *********"
sudo docker exec -it cli-manufacturer-1 peer chaincode invoke -o orderer1.gov.io:7050 --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" -C mfd-rtlr-channel-5 -n fabcar --peerAddresses peerbb1.retailer.com:11051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/retailer.com/peers/peerbb1.retailer.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt" -c '{"function":"InitLedger","Args":[]}'
sleep 8