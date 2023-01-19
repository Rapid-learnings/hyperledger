#!/bin/sh
VERSION="1"

fabcarCC(){
    echo "********** Packaging fabcarCC for Manufacture-Production-Channel ********************"
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode package fabcar.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/typescript --lang node --label fabcar_${VERSION}

    sleep 6

    # sudo docker exec -it cli-production-1 peer lifecycle chaincode package basic.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mfc-prdc --lang node --label basic_1.0
    sudo docker exec -it cli-production-1 peer lifecycle chaincode package fabcar.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/typescript --lang node --label fabcar_${VERSION}

    sleep 6

    echo "********** ChainCode Packaged for Manufacture-Production-Channel ********************"

    echo "********* Installing CC for Manufacture-Production-Channel ************ "
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode install /opt/gopath/src/github.com/hyperledger/fabric/peer/fabcar.tar.gz
    
    sleep 6
    
    sudo docker exec -it cli-production-1 peer lifecycle chaincode install /opt/gopath/src/github.com/hyperledger/fabric/peer/fabcar.tar.gz

    sleep 6
}
mfdPrdCC(){

    echo '********** installing and building typescript chaincode *************'
    cd ./chaincode/mfc-prdc
    npm install
    npm run build
    cd ../..

    echo "********** Packaging CC for Manufacture-Production-Channel ********************"
    # sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode package basic.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mfc-prdc --lang node --label basic_1.0
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode package pmcc.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mfc-prdc --lang node --label basic_${VERSION}

    sleep 6

    # sudo docker exec -it cli-production-1 peer lifecycle chaincode package basic.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mfc-prdc --lang node --label basic_1.0
    sudo docker exec -it cli-production-1 peer lifecycle chaincode package pmcc.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mfc-prdc --lang node --label basic_${VERSION}

    sleep 6

    echo "********** ChainCode Packaged for Manufacture-Production-Channel ********************"

    echo "********* Installing CC for Manufacture-Production-Channel ************ "
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode install /opt/gopath/src/github.com/hyperledger/fabric/peer/pmcc.tar.gz
    
    sleep 6
    
    sudo docker exec -it cli-production-1 peer lifecycle chaincode install /opt/gopath/src/github.com/hyperledger/fabric/peer/pmcc.tar.gz

    sleep 6
}

mfdWhsCC(){
    echo '********** installing and building typescript chaincode *************'
    cd ./chaincode/mfd-whs
    npm install
    npm run build
    cd ../..

    echo "********** Packaging CC for Manufacture-warehouse-Channel ********************"
    # sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode package basic.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mfc-prdc --lang node --label basic_1.0
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode package mwcc.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mfd-whs --lang node --label mw_${VERSION}

    sleep 6

    # sudo docker exec -it cli-production-1 peer lifecycle chaincode package basic.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mfc-prdc --lang node --label basic_1.0
    sudo docker exec -it cli-warehouse-1 peer lifecycle chaincode package mwcc.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mfd-whs --lang node --label mw_${VERSION}

    sleep 6

    echo "********** ChainCode Packaged for Manufacture-warehouse-Channel ********************"

    echo "********* Installing CC for Manufacture-warehouse-Channel ************ "
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode install /opt/gopath/src/github.com/hyperledger/fabric/peer/mwcc.tar.gz
    
    sleep 6
    
    sudo docker exec -it cli-warehouse-1 peer lifecycle chaincode install /opt/gopath/src/github.com/hyperledger/fabric/peer/mwcc.tar.gz

    sleep 6
}

whsRtlrCC(){
    echo '********** installing and building typescript chaincode *************'
    cd ./chaincode/whs-rtlr
    npm install
    npm run build
    cd ../..

    echo "********** Packaging CC for Retailer-warehouse-Channel ********************"
    # sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode package basic.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mfc-prdc --lang node --label basic_1.0
    sudo docker exec -it cli-warehouse-1 peer lifecycle chaincode package wrcc.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/whs-rtlr --lang node --label wr_${VERSION}

    sleep 6

    # sudo docker exec -it cli-production-1 peer lifecycle chaincode package basic.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mfc-prdc --lang node --label basic_1.0
    sudo docker exec -it cli-retail-1 peer lifecycle chaincode package wrcc.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/whs-rtlr --lang node --label wr_${VERSION}

    sleep 6

    echo "********** ChainCode Packaged for Retailer-warehouse-Channel ********************"

    echo "********* Installing CC for Retailer-warehouse-Channel ************ "
    sudo docker exec -it cli-warehouse-1 peer lifecycle chaincode install /opt/gopath/src/github.com/hyperledger/fabric/peer/wrcc.tar.gz
    
    sleep 6
    
    sudo docker exec -it cli-retail-1 peer lifecycle chaincode install /opt/gopath/src/github.com/hyperledger/fabric/peer/wrcc.tar.gz

    sleep 6
}

ApproveFabcarCC(){
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode queryinstalled > fb.txt 2>&1
    cat fb.txt
    # CC_PACKAGE_ID=$(sed -n "/${CC_NAME}_${CC_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
    export CC_PACKAGE_ID=$(cat fb.txt | grep "fabcar" | cut -d " " -f 3 | cut -d "," -f 1)
    #   export CC_PACKAGE_ID
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode approveformyorg -o orderer1.gov.io:7050 --channelID mfd-prd-channel --name fabcar --version ${VERSION} --package-id ${CC_PACKAGE_ID} --sequence ${VERSION} --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem"

    sleep 5

    sudo docker exec -it cli-production-1 peer lifecycle chaincode approveformyorg -o orderer1.gov.io:7050 --channelID mfd-prd-channel --name fabcar --version ${VERSION} --package-id ${CC_PACKAGE_ID} --sequence ${VERSION} --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem"

    sleep 5
}
ApproveCCMfdPrd(){
    # echo -n "" > log.txt 2>&1
    # echo -n "" > mw.txt 2>&1
    
    # sed -i 'd' log.txt
    # sed -i 'd' mw.txt
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode queryinstalled > log.txt 2>&1
    cat log.txt
    # CC_PACKAGE_ID=$(sed -n "/${CC_NAME}_${CC_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
    export CC_PACKAGE_ID=$(cat log.txt | grep "basic" | cut -d " " -f 3 | cut -d "," -f 1)
    #   export CC_PACKAGE_ID
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode approveformyorg -o orderer1.gov.io:7050 --channelID mfd-prd-channel --name pmcc --version ${VERSION} --package-id ${CC_PACKAGE_ID} --sequence ${VERSION} --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem"

    sleep 5

    sudo docker exec -it cli-production-1 peer lifecycle chaincode approveformyorg -o orderer1.gov.io:7050 --channelID mfd-prd-channel --name pmcc --version ${VERSION} --package-id ${CC_PACKAGE_ID} --sequence ${VERSION} --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem"

    sleep 5
}

ApproveCCMfdWhs(){
    # echo -n "" > mw.txt 2>&1
    # echo -n "" > log.txt 2>&1

    # sed -i 'd' mw.txt
    # sed -i 'd' log.txt
    sudo docker exec -it cli-warehouse-1 peer lifecycle chaincode queryinstalled > mw.txt 2>&1
    cat mw.txt
    # MW_PACKAGE_ID=$(sed -n "/${CC_NAME}_${CC_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" mw.txt)
    export MW_PACKAGE_ID=$(cat mw.txt | grep "mw" | cut -d " " -f 3 | cut -d "," -f 1)
#   export CC_PACKAGE_ID
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode approveformyorg -o orderer1.gov.io:7050 --channelID mfd-whs-channel --name mwcc --version 1 --package-id ${MW_PACKAGE_ID} --sequence ${VERSION} --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem"

    sleep 5

    sudo docker exec -it cli-warehouse-1 peer lifecycle chaincode approveformyorg -o orderer1.gov.io:7050 --channelID mfd-whs-channel --name mwcc --version 1 --package-id ${MW_PACKAGE_ID} --sequence ${VERSION} --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem"

    sleep 5
}

ApproveCCWhsRtlr(){
    # echo -n "" > wr.txt 2>&1
    # echo -n "" > mw.txt 2>&1

    # sed -i 'd' wrcc.txt
    # sed -i 'd' mw.txt
    sudo docker exec -it cli-retail-1 peer lifecycle chaincode queryinstalled > wr.txt 2>&1
    cat wr.txt
    # CC_PACKAGE_ID=$(sed -n "/${CC_NAME}_${CC_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" wrcc.txt)
    export CC_PACKAGE_ID=$(cat wr.txt | grep "wr" | cut -d " " -f 3 | cut -d "," -f 1)
    #   export CC_PACKAGE_ID
    sudo docker exec -it cli-warehouse-1 peer lifecycle chaincode approveformyorg -o orderer1.gov.io:7050 --channelID whs-rtlr-channel --name wrcc --version 1 --package-id ${CC_PACKAGE_ID} --sequence ${VERSION} --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem"

    sleep 5

    sudo docker exec -it cli-retail-1 peer lifecycle chaincode approveformyorg -o orderer1.gov.io:7050 --channelID whs-rtlr-channel --name wrcc --version 1 --package-id ${CC_PACKAGE_ID} --sequence ${VERSION} --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem"

    sleep 5    
}

CheckCommitFabcarCC(){
    echo "Checking Commit Readiness for Channel mfd-prd-channel"
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode checkcommitreadiness --channelID mfd-prd-channel --name fabcar --version 1 --sequence ${VERSION} --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --output json
    sleep 8
}

CheckCommitMfdPrd(){
    echo "Checking Commit Readiness for Channel mfd-prd-channel"
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode checkcommitreadiness --channelID mfd-prd-channel --name pmcc --version 1 --sequence ${VERSION} --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --output json
    sleep 8
}

CheckCommitMfdWhs(){
    echo "Checking Commit Readiness for Channel mfd-whs-channel"
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode checkcommitreadiness --channelID mfd-whs-channel --name mwcc --version 1 --sequence ${VERSION} --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --output json
    sleep 8
}

CheckCommitWhsRtlr(){
    echo "Checking Commit Readiness for Channel whs-rtlr-channel"
    sudo docker exec -it cli-warehouse-1 peer lifecycle chaincode checkcommitreadiness --channelID whs-rtlr-channel --name wrcc --version 1 --sequence ${VERSION} --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --output json
    sleep 8
}

CommitFabcarCC(){
    echo "******************** Making commit **********************"
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode commit -o orderer1.gov.io:7050 --channelID mfd-prd-channel --name fabcar --version 1 --sequence ${VERSION} --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peertf1.production.com:8051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/production.com/peers/peertf1.production.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt"

    sleep 8

    echo "****** Invoking fabcar ChainCode On Mfc-Prd-Channel *********"
    sudo docker exec -it cli-manufacturer-1 peer chaincode invoke -o orderer1.gov.io:7050 --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" -C mfd-prd-channel -n fabcar --peerAddresses peertf1.production.com:8051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/production.com/peers/peertf1.production.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt" -c '{"function":"initLedger","Args":[]}'
    sleep 8
}

CommitCCMfdPrd(){
    echo "******************** Making commit **********************"
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode commit -o orderer1.gov.io:7050 --channelID mfd-prd-channel --name pmcc --version 1 --sequence ${VERSION} --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peertf1.production.com:8051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/production.com/peers/peertf1.production.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt"

    sleep 8
}

CommitCCMfdWhs(){
    echo "******************** Making commit **********************"
    sudo docker exec -it cli-warehouse-1 peer lifecycle chaincode commit -o orderer1.gov.io:7050 --channelID mfd-whs-channel --name mwcc --version 1 --sequence ${VERSION} --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peerts1.warehouse.com:10051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/warehouse.com/peers/peerts1.warehouse.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt"

    sleep 8
}

CommitCCWhsRtlr(){
    echo "******************** Making commit **********************"
    sudo docker exec -it cli-retail-1 peer lifecycle chaincode commit -o orderer1.gov.io:7050 --channelID whs-rtlr-channel --name wrcc --version 1 --sequence ${VERSION} --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peerts1.warehouse.com:10051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/warehouse.com/peers/peerts1.warehouse.com/tls/ca.crt" --peerAddresses peerbb1.retailer.com:11051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/retailer.com/peers/peerbb1.retailer.com/tls/ca.crt"

    sleep 8
}


InstantiateCCMfdPrd(){
    echo "Instantiating CC on Production peer-1"
    sudo docker exec -it cli-production-1 peer chaincode instantiate -o orderer1.gov.io:7050 --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" -C mfd-prd-channel -n basic -v 1 -c '{"Args":["init"]}' -P "AND ('tataMSP.peer','teafarmMSP.peer')"

    sleep 8

    echo "Instantiating CC on Manufacture peer-1"
    sudo docker exec -it cli-manufacturer-1 peer chaincode instantiate -o orderer1.gov.io:7050 --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" -C mfd-prd-channel -n basic -v 1 -c '{"Args":["init"]}' -P "AND ('tataMSP.peer','teafarmMSP.peer')"

    sleep 8
}


mfdPrdCC
# mfdWhsCC
# whsRtlrCC
ApproveCCMfdPrd
# ApproveCCMfdWhs
# ApproveCCWhsRtlr
CheckCommitMfdPrd
# CheckCommitMfdWhs
# CheckCommitWhsRtlr
CommitCCMfdPrd
# CommitCCMfdWhs
# CommitCCWhsRtlr
# InstantiateCCMfdPrd

# fabcarCC
# ApproveFabcarCC
# CheckCommitFabcarCC
# CommitFabcarCC