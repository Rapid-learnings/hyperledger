VERSION='1'
InvokeCCMfdPrd(){
    echo "****** Invoking ChainCode On Mfc-Prd-Channel *********"
    sudo docker exec -it cli-production-1 peer chaincode invoke -o orderer1.gov.io:7050 --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" -C mfd-prd-channel -n pmcc --peerAddresses peertf1.production.com:8051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/production.com/peers/peertf1.production.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt" -c '{"function":"init","Args":["100000"]}'
    sleep 8
}

QueryCCMfdPrd(){  
    echo "*********************** Query ChainCode For Mfd-Prd-Channel , Fetching Balance Of Manufacturer *********************************"
    sudo docker exec -it cli-manufacturer-1 peer chaincode query -C mfd-prd-channel -n pmcc -c '{"Args":["getManufacturerFunds"]}'

    sleep 8

    echo "*********************** Query ChainCode For Mfd-Prd-Channel , Fetching Balance Of Production *********************************"
    sudo docker exec -it cli-manufacturer-1 peer chaincode query -C mfd-prd-channel -n pmcc -c '{"Args":["getProducerFunds"]}'

    sleep 8

    echo "*********************** Query ChainCode For Mfd-Prd-Channel , Fetching Initial Production Stock *********************************"
    sudo docker exec -it cli-manufacturer-1 peer chaincode query -C mfd-prd-channel -n pmcc -c '{"Args":["availableStock"]}'

}

PlaceOrder(){
        echo "*********************** Query ChainCode For Mfd-Prd-Channel , Placing Order *********************************"
    sudo docker exec -it cli-manufacturer-1 peer chaincode invoke -o orderer1.gov.io:7050 --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" -C mfd-prd-channel -n pmcc --peerAddresses peertf1.production.com:8051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/production.com/peers/peertf1.production.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt" -c '{"function":"placeOrder","Args":["2700","INDIA","DELHI"]}'

    sleep 8
        echo "*********************** Query ChainCode For Mfd-Prd-Channel , Query Order *********************************"
    sudo docker exec -it cli-manufacturer-1 peer chaincode query -C mfd-prd-channel -n pmcc -c '{"Args":["getOrderDetails","1"]}'

    sleep 8
}

UpdateStatus(){
    echo "####### Updating Status To In-Transit #########"
    sudo docker exec -it cli-production-1 peer chaincode invoke -o orderer1.gov.io:7050 --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" -C mfd-prd-channel -n pmcc --peerAddresses peertf1.production.com:8051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/production.com/peers/peertf1.production.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt" -c '{"function":"updateStatusToInTransit","Args":["1"]}'
    sleep 8

    echo "###### Updating Status To Delivered"
    sudo docker exec -it cli-production-1 peer chaincode invoke -o orderer1.gov.io:7050 --tls true --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" -C mfd-prd-channel -n pmcc --peerAddresses peertf1.production.com:8051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/production.com/peers/peertf1.production.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt" -c '{"function":"updateStatusToDelivered","Args":["1"]}'
    # sleep 8
}

InvokeCCMfdPrd
QueryCCMfdPrd
PlaceOrder
UpdateStatus