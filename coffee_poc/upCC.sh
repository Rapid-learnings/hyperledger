#!/bin/sh
export PATH=${PWD}/bin:$PATH
export FABRIC_CFG_PATH=${PWD}/config

VERSION="4"
# echo $VERSION
# if [2 == "pmcc"]; then
#     pmcc()
# fi

echo ${COMPOSE_PROJECT_NAME}

# peer chaincode upgrade -o orderer1.gov.io:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem -C mfd-prd-channel -n pmcc -v 2 -c '{"Args":["init"]}' -P "AND ('tata.peer','teafarm.peer')"

pmcc(){
    echo "Repackaging PMCC By Manufacturer"
    sudo docker exec -it cli-manufacturer-1  peer lifecycle chaincode package pmcc.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mfc-prdc --lang node --label basic_2

    sleep 8 

    echo "Repackaging PMCC By Production"
    sudo docker exec -it cli-production-1  peer lifecycle chaincode package pmcc.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mfc-prdc --lang node --label basic_2

    sleep 8

    echo "Installing on Manufacturer Peer 1"
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode install /opt/gopath/src/github.com/hyperledger/fabric/peer/pmcc.tar.gz


    sleep 8

    echo "Installing on Production Peer 1"
    sudo docker exec -it cli-production-1 peer lifecycle chaincode install /opt/gopath/src/github.com/hyperledger/fabric/peer/pmcc.tar.gz


    sleep 8

    sudo docker exec -it cli-manufacturer-1  peer chaincode queryinstalled > log1.txt 2>&1

    export PACKAGE_ID=$(cat log.txt | grep "basic" | cut -d " " -f 3 | cut -d "," -f 1)

    echo "Approving For Mfc"
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode approveformyorg -o orderer1.gov.io:7050 --channelID mfd-prd-channel --name pmcc --version ${VERSION} --package-id ${PACKAGE_ID} --sequence ${VERSION} --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem"

    sleep 8

    echo "Approving For Prd"
    sudo docker exec -it cli-production-1 peer lifecycle chaincode approveformyorg -o orderer1.gov.io:7050 --channelID mfd-prd-channel --name pmcc --version ${VERSION} --package-id ${PACKAGE_ID} --sequence ${VERSION} --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem"

    sleep 8 

    echo "Checking Commit Readiness for Channel mfd-prd-channel"
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode checkcommitreadiness --channelID mfd-prd-channel --name pmcc --version ${VERSION} --sequence ${VERSION} --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --output json
    
    sleep 8

    echo "******************** Making Commit Mfc-Prd **********************"
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode commit -o orderer1.gov.io:7050 --channelID mfd-prd-channel --name pmcc --version ${VERSION} --sequence ${VERSION} --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peertf1.production.com:8051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/production.com/peers/peertf1.production.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt"

    sleep 8

    echo "################ Invoking Init function ######################"
    sudo docker exec -it cli-production-1 peer chaincode invoke -o orderer1.gov.io:7050 --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" -C mfd-prd-channel -n pmcc --peerAddresses peertf1.production.com:8051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/production.com/peers/peertf1.production.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt" -c '{"function":"init","Args":["100000"]}'

    sleep 8

    echo "############# Query Hello Function ###############"
    sudo docker exec -it cli-manufacturer-1 peer chaincode query -C mfd-prd-channel -n pmcc -c '{"Args":["hello"]}'

    echo "############# Query Hello2 Function ###############"
    sudo docker exec -it cli-manufacturer-1 peer chaincode query -C mfd-prd-channel -n pmcc -c '{"Args":["hello2"]}'

}

# pmcc