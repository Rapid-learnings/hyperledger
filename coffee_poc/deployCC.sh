#!/bin/sh
export VERSION="1"
export FABRIC_CFG_PATH=${PWD}/config

mfdPrdCC(){
    echo "********** Packaging CC for Manufacture-Production-Channel ********************"
    # sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode package basic.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mfc-prdc --lang node --label basic_1.0
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode package ./chaincode/pmcc.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mfc-prdc --lang node --label pmcc_1

    sleep 6

    # sudo docker exec -it cli-production-1 peer lifecycle chaincode package ./chaincode/pmcc.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/pmcc --lang node --label pmcc_${VERSION}

    # sleep 6

    echo "********** ChainCode Packaged for Manufacture-Production-Channel ********************"

    echo "********* Installing CC for Manufacture-Production-Channel ************ "
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode install /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/pmcc.tar.gz
    
    sleep 6
    
    sudo docker exec -it cli-production-1 peer lifecycle chaincode install /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/pmcc.tar.gz

    sleep 6
}

mfdWhsCC(){
    echo "********** Packaging CC for Manufacture-warehouse-Channel ********************"
    # sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode package basic.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mfc-prdc --lang node --label basic_1.0
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode package ./chaincode/mwcc.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mfd-whs --lang node --label mwcc_1

    sleep 6

    # sudo docker exec -it cli-warehouse-1 peer lifecycle chaincode package mw.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mwcc --lang node --label mw_1

    # sleep 6

    echo "********** ChainCode Packaged for Manufacture-warehouse-Channel ********************"

    echo "********* Installing CC for Manufacture-warehouse-Channel ************ "
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode install /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mwcc.tar.gz
    
    sleep 6
    
    sudo docker exec -it cli-warehouse-1 peer lifecycle chaincode install /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mwcc.tar.gz

    sleep 6
}

whsRtlrCC(){
    echo "********** Packaging CC for Retailer-warehouse-Channel ********************"
    sudo docker exec -it cli-warehouse-1 peer lifecycle chaincode package ./chaincode/wrcc.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/whs-rtlr --lang node --label wrcc_1

    sleep 6

    echo "********** ChainCode Packaged for Retailer-warehouse-Channel ********************"
    echo "********* Installing CC for Retailer-warehouse-Channel ************ "
    sudo docker exec -it cli-warehouse-1 peer lifecycle chaincode install /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/wrcc.tar.gz
    
    sleep 6
    
    sudo docker exec -it cli-retail-1 peer lifecycle chaincode install /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/wrcc.tar.gz

    sleep 6
}


ApproveCCMfdPrd(){
  sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode queryinstalled > log.txt 2>&1
  cat log.txt
  export CC_PACKAGE_ID=$(cat log.txt | grep "pmcc" | cut -d " " -f 3 | cut -d "," -f 1)
#   export CC_PACKAGE_ID=$(sed -n "/${CC_NAME}_${CC_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
#   export CC_PACKAGE_ID
 sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode approveformyorg -o orderer1.gov.io:7050 --channelID mfd-prd-channel --name pmcc --version 1.0 --sequence 1 --init-required --package-id ${CC_PACKAGE_ID} --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem"

 sleep 5

 sudo docker exec -it cli-production-1 peer lifecycle chaincode approveformyorg -o orderer1.gov.io:7050 --channelID mfd-prd-channel --name pmcc --version 1.0 --init-required --package-id ${CC_PACKAGE_ID} --sequence 1 --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem"

 sleep 5
}

ApproveCCMfdWhs(){
  sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode queryinstalled > mwcc.txt 2>&1
  cat mwcc.txt
  export CC_PACKAGE_ID=$(cat mwcc.txt | grep "mwcc" | cut -d " " -f 3 | cut -d "," -f 1)
#   export CC_PACKAGE_ID=$(sed -n "/${CC_NAME}_${CC_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" mw.txt)
#   export CC_PACKAGE_ID
 sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode approveformyorg -o orderer1.gov.io:7050 --channelID mfd-whs-channel --name mwcc --version 1.0 --init-required --package-id ${CC_PACKAGE_ID} --sequence 1 --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem"

 sleep 5

 sudo docker exec -it cli-warehouse-1 peer lifecycle chaincode approveformyorg -o orderer1.gov.io:7050 --channelID mfd-whs-channel --name mwcc --version 1.0 --init-required --package-id ${CC_PACKAGE_ID} --sequence 1 --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem"

 sleep 5
}

ApproveCCWhsRtlr(){
  sudo docker exec -it cli-warehouse-1 peer lifecycle chaincode queryinstalled > wrcc.txt 2>&1 
  cat wrcc.txt
  export CC_PACKAGE_ID=$(cat wrcc.txt | grep "wrcc" | cut -d " " -f 3 | cut -d "," -f 1)
#   CC_PACKAGE_ID=$(sed -n "/${CC_NAME}_${CC_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" wr.txt)
#   export CC_PACKAGE_ID
 sudo docker exec -it cli-warehouse-1 peer lifecycle chaincode approveformyorg -o orderer1.gov.io:7050 --channelID whs-rtlr-channel --name wrcc --version 1.0 --init-required --package-id ${CC_PACKAGE_ID} --sequence 1 --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem"

 sleep 5

 sudo docker exec -it cli-retail-1 peer lifecycle chaincode approveformyorg -o orderer1.gov.io:7050 --channelID whs-rtlr-channel --name wrcc --version 1.0 --init-required --package-id ${CC_PACKAGE_ID} --sequence 1 --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem"

 sleep 5    
}

CheckCommitMfdPrd(){
echo "Checking Commit Readiness for Channel mfd-prd-channel"
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode checkcommitreadiness --channelID mfd-prd-channel --name pmcc --version 1.0 --sequence 1 --output json --init-required
sleep 8
}

CheckCommitMfdWhs(){
echo "Checking Commit Readiness for Channel mfd-whs-channel"
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode checkcommitreadiness --channelID mfd-whs-channel --name mwcc --version 1.0 --sequence 1 --init-required --output json 
sleep 8
}

CheckCommitWhsRtlr(){
echo "Checking Commit Readiness for Channel whs-rtlr-channel"
    sudo docker exec -it cli-warehouse-1 peer lifecycle chaincode checkcommitreadiness --channelID whs-rtlr-channel --name wrcc --version 1.0 --sequence 1 --init-required --output json
sleep 8
}


CommitCCMfdPrd(){
    echo "******************** Making commit **********************"
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode commit -o orderer1.gov.io:7050 --channelID mfd-prd-channel --name pmcc --version 1.0 --sequence 1 --init-required --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peertf1.production.com:8051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/production.com/peers/peertf1.production.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt"

    sleep 8
}

CommitCCMfdWhs(){
    echo "******************** Making commit **********************"
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode commit -o orderer1.gov.io:7050 --channelID mfd-whs-channel --name mwcc --version 1.0 --sequence 1 --init-required --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peerts1.warehouse.com:10051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/warehouse.com/peers/peerts1.warehouse.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt"

    sleep 8
}

CommitCCWhsRtlr(){
    echo "******************** Making commit **********************"
    sudo docker exec -it cli-warehouse-1 peer lifecycle chaincode commit -o orderer1.gov.io:7050 --channelID whs-rtlr-channel --name wrcc --version 1.0 --sequence 1 --init-required --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peerts1.warehouse.com:10051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/warehouse.com/peers/peerts1.warehouse.com/tls/ca.crt" --peerAddresses peerbb1.retailer.com:11051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/retailer.com/peers/peerbb1.retailer.com/tls/ca.crt"

    sleep 8
}


mfdPrdCC
sleep 6
mfdWhsCC
sleep 6
whsRtlrCC
sleep 6
ApproveCCMfdPrd
sleep 6
ApproveCCMfdWhs
sleep 6
ApproveCCWhsRtlr
sleep 6
CheckCommitMfdPrd
sleep 6
CheckCommitMfdWhs
sleep 6
CheckCommitWhsRtlr
sleep 6
CommitCCMfdPrd
sleep 6
CommitCCMfdWhs
sleep 6
CommitCCWhsRtlr
sleep 6

