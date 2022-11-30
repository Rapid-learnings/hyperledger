#!/bin/sh



placeOrder(){
    echo "############### Placing Order for 100 kg in PMCC ###############"
    sudo docker exec -it cli-manufacturer-1 peer chaincode invoke -o orderer1.gov.io:7050 --channelID mfd-prd-channel --name mfcprd --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peertf1.production.com:7051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/production.com/peers/peertf1.production.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt" -c '{"Args":["placeOrder", "100", "Banglore", "Karnataka"]}'
}

queryRawStock(){
    echo "############### CC call for raw stock from mfd-whs-channel to mfd-prd-channel ###############"
    sudo docker exec -it cli-manufacturer-1 peer chaincode query --channelID mfd-whs-channel --name mw -c '{"Args":["returnRawStockAccordingToPMCC"]}'

    sleep 6

    echo "############### updte raw stock ###############"
    sudo docker exec -it cli-manufacturer-1 peer chaincode invoke -o orderer1.gov.io:7050 --channelID mfd-whs-channel --name mw --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peerts1.wharehouse.com:11051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt" -c '{"Args":["updateRawStock", "100", "0"]}'
    
    sleep 6
}

dry(){
    echo "############### Drying 100 kg with 5 kg loss ###############"
    sudo docker exec -it cli-manufacturer-1 peer chaincode invoke -o orderer1.gov.io:7050 --channelID mfd-whs-channel --name mw --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peerts1.wharehouse.com:11051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt" -c '{"Args":["dry", "100", "95"]}'
}

queryRawAndDryStock(){
    echo "############### CC call Raw stock after drying ###############"
    sudo docker exec -it cli-manufacturer-1 peer chaincode query --channelID mfd-whs-channel --name mw -c '{"Args":["returnRawStockAccordingToPMCC"]}'

    echo "############### dried stock after drying ###############"
    sudo docker exec -it cli-manufacturer-1 peer chaincode query --channelID mfd-whs-channel --name mw -c '{"Args":["availableDriedStock"]}'
}

roast(){
    echo "############### roasting 95 kg with 5 kg loss ###############"
    sudo docker exec -it cli-manufacturer-1 peer chaincode invoke -o orderer1.gov.io:7050 --channelID mfd-whs-channel --name mw --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peerts1.wharehouse.com:11051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt" -c '{"Args":["roast", "95", "90"]}'
}

queryRawDryAndRoastedStock(){
    echo "############### Raw stock after roasting ###############"
    sudo docker exec -it cli-manufacturer-1 peer chaincode query --channelID mfd-whs-channel --name mw -c '{"Args":["returnRawStockAccordingToPMCC"]}'

    echo "############### dried stock after roasting ###############"
    sudo docker exec -it cli-manufacturer-1 peer chaincode query --channelID mfd-whs-channel --name mw -c '{"Args":["availableDriedStock"]}'

    echo "############### Roasted stock after roasting ###############"
    sudo docker exec -it cli-manufacturer-1 peer chaincode query --channelID mfd-whs-channel --name mw -c '{"Args":["availableRoastedStock"]}'
}

qa(){
    echo "############### doing qa 90 kg with 10 kg loss ###############"
    sudo docker exec -it cli-manufacturer-1 peer chaincode invoke -o orderer1.gov.io:7050 --channelID mfd-whs-channel --name mw --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peerts1.wharehouse.com:11051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt" -c '{"Args":["doQA", "90", "80"]}'
}

queryRawDryRoastedAndFinishedStock(){
    echo "############### Raw stock after qa ###############"
    sudo docker exec -it cli-manufacturer-1 peer chaincode query --channelID mfd-whs-channel --name mw -c '{"Args":["returnRawStockAccordingToPMCC"]}'

    echo "############### dried stock after qa ###############"
    sudo docker exec -it cli-manufacturer-1 peer chaincode query --channelID mfd-whs-channel --name mw -c '{"Args":["availableDriedStock"]}'

    echo "############### Roasted stock after qa ###############"
    sudo docker exec -it cli-manufacturer-1 peer chaincode query --channelID mfd-whs-channel --name mw -c '{"Args":["availableRoastedStock"]}'

    echo "############### Finished stock after qa ###############"
    sudo docker exec -it cli-manufacturer-1 peer chaincode query --channelID mfd-whs-channel --name mw -c '{"Args":["availableFinishedStock"]}'
}
package(){
    echo "############### packging 100 kg ###############"
    sudo docker exec -it cli-manufacturer-1 peer chaincode invoke -o orderer1.gov.io:7050 --channelID mfd-whs-channel --name mw --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peerts1.wharehouse.com:11051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt" -c '{"Args":["package", "50"]}'

    sleep 6

    echo "############### Finished stock after packaging ###############"
    sudo docker exec -it cli-manufacturer-1 peer chaincode query --channelID mfd-whs-channel --name mw -c '{"Args":["availableFinishedStock"]}'

    echo "############### Querying total packages ###############"
    sudo docker exec -it cli-manufacturer-1 peer chaincode query --channelID mfd-whs-channel --name mw -c '{"Args":["getTotalPackages"]}'

}

dispatch(){
    echo "############### dispatching 1 package ###############"
    sudo docker exec -it cli-manufacturer-1 peer chaincode invoke -o orderer1.gov.io:7050 --channelID mfd-whs-channel --name mw --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peerts1.wharehouse.com:11051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" --peerAddresses peertm1.manufacturer.com:9051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt" -c '{"Args":["dispatch", "1"]}'

    sleep 6

    echo "############### Querying total packages after dispatch ###############"
    sudo docker exec -it cli-manufacturer-1 peer chaincode query --channelID mfd-whs-channel --name mw -c '{"Args":["getTotalPackages"]}'

    echo "############### Querying warehouse stock after dispatch ###############"
    sudo docker exec -it cli-manufacturer-1 peer chaincode query --channelID mfd-whs-channel --name mw -c '{"Args":["getWharehouseStock"]}'
}

placeOrderRetailer(){
    echo "############### CC call to query stock from mfd-whs-channel ###############"
    sudo docker exec -it cli-wharehouse-1 peer chaincode query --channelID whs-rtlr-channel --name wr -c '{"Args":["returnWarehouseSTockAccordingToPMCC"]}'

    sleep 6

    echo "############### updte wrhouse stock ###############"
    sudo docker exec -it cli-retail-1 peer chaincode invoke -o orderer1.gov.io:7050 --channelID whs-rtlr-channel --name wr --tls --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peerts1.wharehouse.com:11051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" --peerAddresses peerbb1.retailer.com:13051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/retailer.com/peers/peerbb1.retailer.com/tls/ca.crt" -c '{"Args":["updateWharehouseStock", "1","1"]}'

    echo "############### place order for retailer ###############"

    sudo docker exec -it cli-retail-1 peer chaincode invoke -o orderer1.gov.io:7050 --channelID whs-rtlr-channel --name wr --tls --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem" --peerAddresses peerts1.wharehouse.com:11051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wharehouse.com/peers/peerts1.wharehouse.com/tls/ca.crt" --peerAddresses peerbb1.retailer.com:13051 --tlsRootCertFiles "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/retailer.com/peers/peerbb1.retailer.com/tls/ca.crt" -c '{"Args":["placeOrder", "1","India","kerala"]}'

} 

queryRetail(){
    echo "############### query stock retailer ###############"
    sudo docker exec -it cli-retail-1 peer chaincode query --channelID whs-rtlr-channel --name wr -c '{"Args":["getRetailerStock"]}'

    echo "############### END OF SUPPLY CHAIN ###############"
}


placeOrder
sleep 6
queryRawStock
sleep 6
dry
sleep 6
queryRawAndDryStock
sleep 6
roast
sleep 6
queryRawDryAndRoastedStock
sleep 6
qa
sleep 6
queryRawDryRoastedAndFinishedStock
sleep 6
package
sleep 6
dispatch
sleep 6
placeOrderRetailer
sleep 6
queryRetail