VERSION='1'
InvokeCCMfdPrd(){
    echo "****** Invoking ChainCode On Mfc-Whs-Channel *********"
    sudo docker exec -it cli-manufacturer-2 peer chaincode invoke -o orderer1.gov.io:7050 --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" -C mfd-whs-channel -n mw --peerAddresses peertm2.manufacturer.com:9080 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm2.manufacturer.com/tls/ca.crt" --peerAddresses peerts1.wharehouse.com:10050 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" -c '{"function":"initialize","Args":[""]}'
    sleep 8
}

availableRawStock(){
    echo "****** Fetching Manufacturer Stock On Mfc-Whs-Channel *********"
    sudo docker exec -it cli-manufacturer-2 peer chaincode invoke -o orderer1.gov.io:7050 --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" -C mfd-whs-channel -n mw --peerAddresses peertm2.manufacturer.com:9080 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm2.manufacturer.com/tls/ca.crt" --peerAddresses peerts1.wharehouse.com:10050 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" -c '{"function":"availableRawStock","Args":[""]}'
    sleep 8
}

dryOperation(){
    echo "######## Performing Dry Coffee Operation #######"
    sudo docker exec -it cli-manufacturer-2 peer chaincode invoke -o orderer1.gov.io:7050 --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" -C mfd-whs-channel -n mw --peerAddresses peertm2.manufacturer.com:9080 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm2.manufacturer.com/tls/ca.crt" --peerAddresses peerts1.wharehouse.com:10050 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" -c '{"function":"dry","Args":["300","250"]}'
    sleep 8
}

roastOperation(){
    echo "######## Performing Roast Coffee Operation #######"
    sudo docker exec -it cli-manufacturer-2 peer chaincode invoke -o orderer1.gov.io:7050 --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" -C mfd-whs-channel -n mw --peerAddresses peertm2.manufacturer.com:9080 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm2.manufacturer.com/tls/ca.crt" --peerAddresses peerts1.wharehouse.com:10050 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" -c '{"function":"roast","Args":["250","250"]}'
    sleep 8    
}

QAOps(){
    echo "######## Performing QA Coffee Operation #######"
    sudo docker exec -it cli-manufacturer-2 peer chaincode invoke -o orderer1.gov.io:7050 --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" -C mfd-whs-channel -n mw --peerAddresses peertm2.manufacturer.com:9080 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm2.manufacturer.com/tls/ca.crt" --peerAddresses peerts1.wharehouse.com:10050 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" -c '{"function":"doQA","Args":["250","200"]}'
    sleep 8    
}

packageCoffee(){
    echo "######## Packaging Coffee Operation #######"
    sudo docker exec -it cli-manufacturer-2 peer chaincode invoke -o orderer1.gov.io:7050 --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" -C mfd-whs-channel -n mw --peerAddresses peertm2.manufacturer.com:9080 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm2.manufacturer.com/tls/ca.crt" --peerAddresses peerts1.wharehouse.com:10050 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" -c '{"function":"package","Args":["200"]}'
    sleep 8
}

dispatchCoffee(){
    echo "######## Packaging Coffee Operation #######"
    sudo docker exec -it cli-manufacturer-2 peer chaincode invoke -o orderer1.gov.io:7050 --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" -C mfd-whs-channel -n mw --peerAddresses peertm2.manufacturer.com:9080 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm2.manufacturer.com/tls/ca.crt" --peerAddresses peerts1.wharehouse.com:10050 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" -c '{"function":"dispatch","Args":["4"]}'
    sleep 8
}

InvokeCCMfdPrd
availableRawStock
dryOperation
roastOperation
QAOps
packageCoffee
dispatchCoffee