export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=${PWD}

VERSION="1"

# fetching new org definition in json format
configtxgen -printOrg fssaiMSP > ../crypto-config/peerOrganizations/safety.io/org3.json

# fetching the latest config block

sudo docker exec -it cli-manufacturer-1 peer channel fetch config /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/config_block.pb -o orderer1.gov.io:7050 --ordererTLSHostnameOverride orderer1.gov.io -c mfd-prd-channel --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem"

echo
echo "Step => 2"
echo

sudo docker exec -it cli-manufacturer-1 configtxlator proto_decode --input /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/config_block.pb --type common.Block --output /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/config_block.json 
echo
echo "Step => 3"
echo

sudo docker exec -it cli-manufacturer-1 ./scripts/helper.sh

# # sign update by mfd - peer - 1
sleep 5

echo
echo "Step => 4"
echo

sudo docker exec -it cli-manufacturer-1 peer channel signconfigtx -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/org3_update_in_envelope.pb --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem"

sleep 5

# export FABRIC_CFG_PATH=${PWD}/../config
echo
echo "Step => 5"
echo

sudo docker exec -it cli-production-1 peer channel update -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/org3_update_in_envelope.pb -c mfd-prd-channel -o orderer1.gov.io:7050 --ordererTLSHostnameOverride orderer1.gov.io --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem"

sleep 5

echo
echo "Step => 6"
echo
# # joining the channel by new org
sudo docker exec -it cli-fssai-1 peer channel fetch 0 channel-artifacts/mfd-prd-genesis.block -o orderer1.gov.io:7050 --ordererTLSHostnameOverride orderer1.gov.io -c mfd-prd-channel --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem"

echo
echo "Step => 7"
echo

sudo docker exec -it cli-fssai-1 peer channel join -b channel-artifacts/mfd-prd-genesis.block

# install chaincode on peer

echo
echo "********** Packaging CC For New Org ********************"
echo
# sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode package basic.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mfc-prdc --lang node --label basic_1.0
sudo docker exec -it cli-fssai-1 peer lifecycle chaincode package pmcc.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mfc-prdc --lang node --label fssai_1

sleep 6

echo "********* Installing CC For New Org ************"
sudo docker exec -it cli-fssai-1 peer lifecycle chaincode install /opt/gopath/src/github.com/hyperledger/fabric/peer/pmcc.tar.gz
    
sleep 6

echo "**************** Approving CC ********************"

sudo docker exec -it cli-fssai-1 peer lifecycle chaincode queryinstalled > fssai.txt 2>&1
cat fssai.txt
# CC_PACKAGE_ID=$(sed -n "/${CC_NAME}_${CC_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
export CC_PACKAGE_ID=$(cat fssai.txt | grep "fssai" | cut -d " " -f 3 | cut -d "," -f 1)
#   export CC_PACKAGE_ID
sudo docker exec -it cli-fssai-1 peer lifecycle chaincode approveformyorg -o orderer1.gov.io:7050 --channelID mfd-prd-channel --name pmcc --version ${VERSION} --package-id ${CC_PACKAGE_ID} --sequence ${VERSION} --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem"

sleep 5

echo "*********************** Query ChainCode For Mfd-Prd-Channel , Fetching Balance Of Manufacturer *********************************"
sudo docker exec -it cli-fssai-1 peer chaincode query -C mfd-prd-channel -n pmcc -c '{"Args":["getManufacturerFunds"]}'

