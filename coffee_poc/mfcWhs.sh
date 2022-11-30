VERSION='1'
InvokeCCMfdPrd(){
    echo "****** Invoking ChainCode On Mfc-Whs-Channel *********"
    sudo docker exec -it cli-wharehouse-1 peer chaincode invoke -o orderer1.gov.io:7050 --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" -C mfd-whs-channel -n mwcc --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt" --peerAddresses peerts1.wharehouse.com:10051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" -c '{"function":"initialize","Args":[""]}'
    sleep 8
}

availableRawStock(){
    echo "****** Fetching Manufacturer Stock On Mfc-Whs-Channel Through Mfd-Prd-Channel ******"
    sudo docker exec -it cli-manufacturer-1 peer chaincode invoke -o orderer1.gov.io:7050 --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" -C mfd-whs-channel -n mwcc --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt" --peerAddresses peerts1.wharehouse.com:10051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" -c '{"function":"updateFromPmcc","Args":[""]}'
    sleep 8
}

getAvailableRawStock(){
    echo "****** RAW STOCK ******"
    sudo docker exec -it cli-wharehouse-1 peer chaincode invoke -o orderer1.gov.io:7050 --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" -C mfd-whs-channel -n mwcc --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt" --peerAddresses peerts1.wharehouse.com:10051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" -c '{"function":"availableRawStock","Args":[""]}'
    sleep 8
}

dryOperation(){
    echo "######## Performing Dry Coffee Operation #######"
    echo "Coffee Going For Dry Operation = 1000 kg"
    echo "Coffee After Dry Operation = 900 kg"

    sudo docker exec -it cli-manufacturer-1 peer chaincode invoke -o orderer1.gov.io:7050 --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" -C mfd-whs-channel -n mwcc --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt" --peerAddresses peerts1.wharehouse.com:10051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" -c '{"function":"dry","Args":["2700","2500"]}'
    sleep 8
}

roastOperation(){
    echo "######## Performing Roast Coffee Operation #######"
    echo "Coffee Going For Roast Operation = 900 kg"
    echo "Coffee After Roast Operation = 750 kg"

    sudo docker exec -it cli-manufacturer-1 peer chaincode invoke -o orderer1.gov.io:7050 --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" -C mfd-whs-channel -n mwcc --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt" --peerAddresses peerts1.wharehouse.com:10051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" -c '{"function":"roast","Args":["2500","2400"]}'
    sleep 8    
}

QAOps(){
    echo "######## Performing QA Coffee Operation #######"
    echo "Coffee Going For Roast Operation = 750 kg"
    echo "Coffee Going For Roast Operation = 500 kg"

    sudo docker exec -it cli-manufacturer-1 peer chaincode invoke -o orderer1.gov.io:7050 --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" -C mfd-whs-channel -n mwcc --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt" --peerAddresses peerts1.wharehouse.com:10051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" -c '{"function":"doQA","Args":["2400","2000"]}'
    sleep 8    
}

packageCoffee(){
    echo "######## Packaging Coffee Operation #######"
    echo "Final Packages Created = 10"
    sudo docker exec -it cli-manufacturer-1 peer chaincode invoke -o orderer1.gov.io:7050 --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" -C mfd-whs-channel -n mwcc --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt" --peerAddresses peerts1.wharehouse.com:10051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" -c '{"function":"package","Args":["2000"]}'
    sleep 8
}

dispatchCoffee(){
    echo "######## Dispatching Coffee Operation #######"
    sudo docker exec -it cli-manufacturer-1 peer chaincode invoke -o orderer1.gov.io:7050 --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" -C mfd-whs-channel -n mwcc --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt" --peerAddresses peerts1.wharehouse.com:10051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" -c '{"function":"dispatch","Args":["40"]}'
    sleep 8
}

InvokeCCMfdPrd
availableRawStock
getAvailableRawStock
dryOperation
roastOperation
QAOps
packageCoffee
dispatchCoffee