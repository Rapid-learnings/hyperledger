VERSION='1'
InvokeCCMfdPrd(){
    echo "****** Invoking ChainCode On Mfc-Prd-Channel *********"
    sudo docker exec -it cli-production-1 peer chaincode invoke -o orderer1.gov.io:7050 --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" -C mfd-prd-channel -n basic --peerAddresses peertf1.production.com:8050 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/production.com/peers/peertf1.production.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9050 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt" -c '{"function":"init","Args":["1000"]}'
    sleep 8
}

QueryCCMfdPrd(){  
    echo "*********************** Query ChainCode For Mfd-Prd-Channel , Fetching Balance Of Manufacturer *********************************"
    sudo docker exec -it cli-manufacturer-1 peer chaincode query -C mfd-prd-channel -n basic -c '{"Args":["getManufacturerFunds"]}'

    sleep 8

    echo "*********************** Query ChainCode For Mfd-Prd-Channel , Fetching Balance Of Production *********************************"
    sudo docker exec -it cli-manufacturer-1 peer chaincode query -C mfd-prd-channel -n basic -c '{"Args":["getProducerFunds"]}'

    sleep 8

    echo "*********************** Query ChainCode For Mfd-Prd-Channel , Fetching Initial Production Stock *********************************"
    sudo docker exec -it cli-manufacturer-1 peer chaincode query -C mfd-prd-channel -n basic -c '{"Args":["availableStock"]}'

}

PlaceOrder(){
        echo "*********************** Query ChainCode For Mfd-Prd-Channel , Placing Order *********************************"
    sudo docker exec -it cli-manufacturer-1 peer chaincode query -C mfd-prd-channel -n basic -c '{"Args":["placeOrder","2","INDIA","DELHI"]}'

    sleep 8
        echo "*********************** Query ChainCode For Mfd-Prd-Channel , Query Order *********************************"
    sudo docker exec -it cli-manufacturer-1 peer chaincode query -C mfd-prd-channel -n basic -c '{"Args":["getOrderDetails","1"]}'

    # sleep 8
}

InvokeCCMfdPrd
QueryCCMfdPrd
PlaceOrder
