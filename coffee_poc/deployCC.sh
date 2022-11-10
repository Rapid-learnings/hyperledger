VERSION="1"

mfdPrdCC(){
    echo "********** Packaging CC for Manufacture-Production-Channel ********************"
    # sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode package basic.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mfc-prdc --lang node --label basic_1.0
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode package mfcprd.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mfc-prdc --lang node --label basic_${VERSION}

    sleep 6

    # sudo docker exec -it cli-production-1 peer lifecycle chaincode package basic.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mfc-prdc --lang node --label basic_1.0
    sudo docker exec -it cli-production-1 peer lifecycle chaincode package mfcprd.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mfc-prdc --lang node --label basic_${VERSION}

    sleep 6

    echo "********** ChainCode Packaged for Manufacture-Production-Channel ********************"

    echo "********* Installing CC for Manufacture-Production-Channel ************ "
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode install /opt/gopath/src/github.com/hyperledger/fabric/peer/mfcprd.tar.gz
    
    sleep 6
    
    sudo docker exec -it cli-production-1 peer lifecycle chaincode install /opt/gopath/src/github.com/hyperledger/fabric/peer/mfcprd.tar.gz

    sleep 6
}

mfdWhsCC(){
    echo "********** Packaging CC for Manufacture-WhareHouse-Channel ********************"
    # sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode package basic.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mfc-prdc --lang node --label basic_1.0
    sudo docker exec -it cli-manufacturer-2 peer lifecycle chaincode package mw.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mfd-whs --lang node --label basic_${VERSION}

    sleep 6

    # sudo docker exec -it cli-production-1 peer lifecycle chaincode package basic.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mfc-prdc --lang node --label basic_1.0
    sudo docker exec -it cli-wharehouse-1 peer lifecycle chaincode package mw.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mfd-whs --lang node --label basic_${VERSION}

    sleep 6

    echo "********** ChainCode Packaged for Manufacture-WhareHouse-Channel ********************"

    echo "********* Installing CC for Manufacture-Wharehouse-Channel ************ "
    sudo docker exec -it cli-manufacturer-2 peer lifecycle chaincode install /opt/gopath/src/github.com/hyperledger/fabric/peer/mw.tar.gz
    
    sleep 6
    
    sudo docker exec -it cli-wharehouse-1 peer lifecycle chaincode install /opt/gopath/src/github.com/hyperledger/fabric/peer/mw.tar.gz

    sleep 6
}

whsRtlrCC(){
    echo "********** Packaging CC for Retailer-WhareHouse-Channel ********************"
    # sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode package basic.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mfc-prdc --lang node --label basic_1.0
    sudo docker exec -it cli-wharehouse-2 peer lifecycle chaincode package wr.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/whs-rtlr --lang node --label basic_${VERSION}

    sleep 6

    # sudo docker exec -it cli-production-1 peer lifecycle chaincode package basic.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/mfc-prdc --lang node --label basic_1.0
    sudo docker exec -it cli-retail-1 peer lifecycle chaincode package wr.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/whs-rtlr --lang node --label basic_${VERSION}

    sleep 6

    echo "********** ChainCode Packaged for Retailer-WhareHouse-Channel ********************"

    echo "********* Installing CC for Retailer-Wharehouse-Channel ************ "
    sudo docker exec -it cli-wharehouse-2 peer lifecycle chaincode install /opt/gopath/src/github.com/hyperledger/fabric/peer/wr.tar.gz
    
    sleep 6
    
    sudo docker exec -it cli-retail-1 peer lifecycle chaincode install /opt/gopath/src/github.com/hyperledger/fabric/peer/wr.tar.gz

    sleep 6
}


ApproveCCMfdPrd(){
  sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode queryinstalled >&log.txt
  cat log.txt
  CC_PACKAGE_ID=$(sed -n "/${CC_NAME}_${CC_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
#   export CC_PACKAGE_ID
 sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode approveformyorg -o orderer1.gov.io:7050 --channelID mfd-prd-channel --name basic --version 1.0 --package-id ${CC_PACKAGE_ID} --sequence ${VERSION} --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem"

 sleep 5

 sudo docker exec -it cli-production-1 peer lifecycle chaincode approveformyorg -o orderer1.gov.io:7050 --channelID mfd-prd-channel --name basic --version 1.0 --package-id ${CC_PACKAGE_ID} --sequence ${VERSION} --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem"

 sleep 5
}

ApproveCCMfdWhs(){
  sudo docker exec -it cli-manufacturer-2 peer lifecycle chaincode queryinstalled >&mw.txt
  cat mw.txt
  CC_PACKAGE_ID=$(sed -n "/${CC_NAME}_${CC_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" mw.txt)
#   export CC_PACKAGE_ID
 sudo docker exec -it cli-manufacturer-2 peer lifecycle chaincode approveformyorg -o orderer1.gov.io:7050 --channelID mfd-whs-channel --name basic --version 1.0 --package-id ${CC_PACKAGE_ID} --sequence ${VERSION} --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem"

 sleep 5

 sudo docker exec -it cli-wharehouse-1 peer lifecycle chaincode approveformyorg -o orderer1.gov.io:7050 --channelID mfd-whs-channel --name basic --version 1.0 --package-id ${CC_PACKAGE_ID} --sequence ${VERSION} --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem"

 sleep 5
}

ApproveCCWhsRtlr(){
  sudo docker exec -it cli-wharehouse-2 peer lifecycle chaincode queryinstalled >&wr.txt
  cat wr.txt
  CC_PACKAGE_ID=$(sed -n "/${CC_NAME}_${CC_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" wr.txt)
#   export CC_PACKAGE_ID
 sudo docker exec -it cli-wharehouse-2 peer lifecycle chaincode approveformyorg -o orderer1.gov.io:7050 --channelID whs-rtlr-channel --name basic --version 1.0 --package-id ${CC_PACKAGE_ID} --sequence ${VERSION} --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem"

 sleep 5

 sudo docker exec -it cli-retail-1 peer lifecycle chaincode approveformyorg -o orderer1.gov.io:7050 --channelID whs-rtlr-channel --name basic --version 1.0 --package-id ${CC_PACKAGE_ID} --sequence ${VERSION} --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem"

 sleep 5    
}

CheckCommitMfdPrd(){
echo "Checking Commit Readiness for Channel mfd-prd-channel"
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode checkcommitreadiness --channelID mfd-prd-channel --name basic --version 1.0 --sequence ${VERSION} --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --output json
sleep 8
}

CheckCommitMfdWhs(){
echo "Checking Commit Readiness for Channel mfd-whs-channel"
    sudo docker exec -it cli-manufacturer-2 peer lifecycle chaincode checkcommitreadiness --channelID mfd-whs-channel --name basic --version 1.0 --sequence ${VERSION} --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --output json
sleep 8
}

CheckCommitWhsRtlr(){
echo "Checking Commit Readiness for Channel whs-rtlr-channel"
    sudo docker exec -it cli-wharehouse-2 peer lifecycle chaincode checkcommitreadiness --channelID whs-rtlr-channel --name basic --version 1.0 --sequence ${VERSION} --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --output json
sleep 8
}


CommitCCMfdPrd(){
    echo "******************** Making commit **********************"
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode commit -o orderer1.gov.io:7050 --channelID mfd-prd-channel --name basic --version 1.0 --sequence ${VERSION} --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peertf1.production.com:8050 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/production.com/peers/peertf1.production.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9050 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt"

    sleep 8
}

CommitCCMfdWhs(){
    echo "******************** Making commit **********************"
    sudo docker exec -it cli-manufacturer-2 peer lifecycle chaincode commit -o orderer1.gov.io:7050 --channelID mfd-whs-channel --name basic --version 1.0 --sequence ${VERSION} --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peerts1.wharehouse.com:10050 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" --peerAddresses peertm2.manufacturer.com:9080 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm2.manufacturer.com/tls/ca.crt"

    sleep 8
}

CommitCCWhsRtlr(){
    echo "******************** Making commit **********************"
    sudo docker exec -it cli-wharehouse-2 peer lifecycle chaincode commit -o orderer1.gov.io:7050 --channelID whs-rtlr-channel --name basic --version 1.0 --sequence ${VERSION} --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peerts2.wharehouse.com:10080 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts2.wharehouse.com/tls/ca.crt" --peerAddresses peerbb1.retailer.com:11050 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/retailer.com/peers/peerbb1.retailer.com/tls/ca.crt"

    sleep 8
}


InstantiateCCMfdPrd(){
    echo "Instantiating CC on Production peer-1"
    sudo docker exec -it cli-production-1 peer chaincode instantiate -o orderer1.gov.io:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem -C mfd-prd-channel -n basic -v 1.0 -c '{"Args":["init"]}' -P "AND ('tataMSP.peer','teafarmMSP.peer')"

    sleep 8

    echo "Instantiating CC on Manufacture peer-1"
   sudo docker exec -it cli-manufacturer-1 peer chaincode instantiate -o orderer1.gov.io:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem -C mfd-prd-channel -n basic -v 1.0 -c '{"Args":["init"]}' -P "AND ('tataMSP.peer','teafarmMSP.peer')"

    sleep 8
}


mfdPrdCC
mfdWhsCC
whsRtlrCC
ApproveCCMfdPrd
ApproveCCMfdWhs
ApproveCCWhsRtlr
CheckCommitMfdPrd
CheckCommitMfdWhs
CheckCommitWhsRtlr
CommitCCMfdPrd
CommitCCMfdWhs
CommitCCWhsRtlr
# InstantiateCCMfdPrd
