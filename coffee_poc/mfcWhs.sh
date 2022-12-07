VERSION='1'
InvokeCCMfdPrd(){
    echo "****** Invoking ChainCode On Mfc-Whs-Channel *********"
    sudo docker exec -it cli-manufacturer-1 peer chaincode invoke -o orderer1.gov.io:7050 --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" -C mfd-whs-channel -n mwcc --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm2.manufacturer.com/tls/ca.crt" --peerAddresses peerts1.wharehouse.com:10051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" -c '{"function":"initialize","Args":[""]}'
    sleep 8
}

availableRawStock(){
    echo "****** CC call Fetching Manufacturer Stock On Mfc-Whs-Channel *********"
    sudo docker exec -it cli-manufacturer-1 peer chaincode query --channelID mfd-whs-channel --name mwcc  -c '{"function":"returnRawStockAccordingToPMCC","Args":[""]}'

    sleep 8
}

dryOperation(){
    echo "######## Performing Dry Coffee Operation #######"
    echo "Coffee Going For Dry Operation = 1000 kg"
    echo "Coffee After Dry Operation = 900 kg"

    sudo docker exec -it cli-manufacturer-1 peer chaincode invoke -o orderer1.gov.io:7050 --channelID mfd-whs-channel --name mwcc --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peerts1.wharehouse.com:10051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt" -c '{"function":"dry","Args":["1000","900"]}'
    sleep 8
}

roastOperation(){
    echo "######## Performing Roast Coffee Operation #######"
    echo "Coffee Going For Roast Operation = 900 kg"
    echo "Coffee After Roast Operation = 750 kg"

    sudo docker exec -it cli-manufacturer-1 peer chaincode invoke -o orderer1.gov.io:7050 --channelID mfd-whs-channel --name mwcc --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peerts1.wharehouse.com:10051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt" -c '{"function":"roast","Args":["900","750"]}'

    sleep 8    
}

QAOps(){
    echo "######## Performing QA Coffee Operation #######"
    echo "Coffee Going For Roast Operation = 750 kg"
    echo "Coffee Going For Roast Operation = 500 kg"

    sudo docker exec -it cli-manufacturer-1 peer chaincode invoke -o orderer1.gov.io:7050 --channelID mfd-whs-channel --name mwcc --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peerts1.wharehouse.com:10051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt" -c '{"function":"doQA","Args":["750","500"]}'

    sleep 8    
}

packageCoffee(){
    echo "######## Packaging Coffee Operation #######"
    echo "Final Packages Created = 10"
    sudo docker exec -it cli-manufacturer-1 peer chaincode invoke -o orderer1.gov.io:7050 --channelID mfd-whs-channel --name mwcc --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peerts1.wharehouse.com:10051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt" -c '{"function":"package","Args":["500"]}'

    sleep 8
}

dispatchCoffee(){
    echo "######## Dispatching Coffee Operation #######"
    sudo docker exec -it cli-manufacturer-1 peer chaincode invoke -o orderer1.gov.io:7050 --channelID mfd-whs-channel --name mwcc --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peerts1.wharehouse.com:10051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt" -c '{"function":"dispatch","Args":["10"]}'

    sleep 8
}

# InvokeCCMfdPrd
availableRawStock
dryOperation
roastOperation
QAOps
packageCoffee
dispatchCoffee