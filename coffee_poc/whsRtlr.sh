VERSION='1'
InvokeCCWhsRtlr(){
    echo "****** Invoking ChainCode On Whs-Rtlr-Channel *********"
    sudo docker exec -it cli-wharehouse-1 peer chaincode invoke -o orderer1.gov.io:7050 --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" -C whs-rtlr-channel -n wrcc --peerAddresses peerts2.wharehouse.com:10080 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts2.wharehouse.com/tls/ca.crt" --peerAddresses peerbb1.retailer.com:11050 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/retailer.com/peers/peerbb1.retailer.com/tls/ca.crt" -c '{"function":"initialize","Args":[""]}'

    sleep 8
}

updateWhsStock(){
    echo "******  updating stock For warehouse *********"
    sudo docker exec -it cli-wharehouse-1 peer chaincode invoke -o orderer1.gov.io:7050 --channelID whs-rtlr-channel --name wrcc --tls --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peerts1.wharehouse.com:10051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" --peerAddresses peerbb1.retailer.com:11051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/retailer.com/peers/peerbb1.retailer.com/tls/ca.crt" -c '{"function":"updateWharehouseStock","Args":["10","1"]}'
    
    sleep 8
}

placeOrder(){
    echo "****** Placing Order For Retailer *********"
    sudo docker exec -it cli-retail-1 peer chaincode invoke -o orderer1.gov.io:7050 --channelID whs-rtlr-channel --name wrcc --tls --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peerts1.wharehouse.com:10051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" --peerAddresses peerbb1.retailer.com:11051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/retailer.com/peers/peerbb1.retailer.com/tls/ca.crt" -c '{"function":"placeOrder","Args":["5","INDIA","KERALA"]}'

    sleep 8
}

getOrderDetails(){
    echo "###################### Fteching Order Details For Retailer ########################"
    sudo docker exec -it cli-retail-1 peer chaincode query -C whs-rtlr-channel -n wrcc -c '{"Args":["getOrderDetails","1"]}'

    sleep 4
}

UpdateStatus(){
    echo "#################### Updating Status To In Transit #######################"
    sudo docker exec -it cli-retail-1 peer chaincode invoke -o orderer1.gov.io:7050 --channelID whs-rtlr-channel --name wrcc --tls --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peerts1.wharehouse.com:10051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" --peerAddresses peerbb1.retailer.com:11051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/retailer.com/peers/peerbb1.retailer.com/tls/ca.crt" -c '{"function":"updateStatusToInTransit","Args":["1"]}'

    sleep 8

    echo "################### Update Status To Delivered #################"
    sudo docker exec -it cli-retail-1 peer chaincode invoke -o orderer1.gov.io:7050 --channelID whs-rtlr-channel --name wrcc --tls --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peerts1.wharehouse.com:10051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" --peerAddresses peerbb1.retailer.com:11051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/retailer.com/peers/peerbb1.retailer.com/tls/ca.crt" -c '{"function":"updateStatusToDelivered","Args":["1"]}'

    sleep 8
}

queryWhsStock(){
    echo "###################### CC call querying warehouse stock ########################"
    sudo docker exec -it cli-wharehouse-1 peer chaincode query -C whs-rtlr-channel -n wrcc -c '{"Args":["returnWarehouseSTockAccordingTomwccCC"]}'
}

queryRetStock(){
    echo "###################### querying retail stock ########################"
    sudo docker exec -it cli-retail-1 peer chaincode query -C whs-rtlr-channel -n wrcc -c '{"Args":["getRetailerStock"]}'
}


# InvokeCCWhsRtlr
queryWhsStock
# updateWhsStock
placeOrder
getOrderDetails
UpdateStatus
queryRetStock