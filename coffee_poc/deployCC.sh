VERSION="1"

mfdPrdCC(){
    echo "********** Packaging CC for Manufacture-Production-Channel ********************"
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode package basic.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode --lang node --label basic_1.0

    sleep 6

    sudo docker exec -it cli-production-1 peer lifecycle chaincode package basic.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode --lang node --label basic_1.0

    sleep 6

    echo "********* Installing CC for Manufacture-Production-Channel ************ "
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode install /opt/gopath/src/github.com/hyperledger/fabric/peer/basic.tar.gz
    
    sleep 6
    
    sudo docker exec -it cli-production-1 peer lifecycle chaincode install /opt/gopath/src/github.com/hyperledger/fabric/peer/basic.tar.gz

    sleep 6
}

# mfdWhsCC(){

# }

# whsRtlrCC(){

# }


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
    echo "Checking Commit Readiness for Channel mfd-prd-channel"
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode checkcommitreadiness --channelID mfd-prd-channel --name basic --version 1.0 --sequence ${VERSION} --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --output json
}

# ApproveCCWhsRtlr(){
    
# }

# CheckCommitMfdPrd(){

# }

# CheckCommitMfdWhs(){

# }

# CheckCommitWhsRtlr(){

# }


CommitCCMfdPrd(){
    echo "******************** Making commit **********************"
    sudo docker exec -it cli-manufacturer-1 peer lifecycle chaincode commit -o orderer1.gov.io:7050 --channelID mfd-prd-channel --name basic --version 1.0 --sequence ${VERSION} --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peertf1.production.com:8050 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/production.com/peers/peertf1.production.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9050 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt"
}

mfdPrdCC
# mfdWhsCC
# whsRtlrCC
ApproveCCMfdPrd
CheckCommitMfdPrd
# CheckCommitMfdWhs
# CheckCommitWhsRtlr
CommitCCMfdPrd