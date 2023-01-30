 peer channel join -b /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/mfd-prd-genesis.block
#!/bin/sh
# starting the docker process
export FABRIC_CFG_PATH=${PWD}/config

cd docker
sudo docker-compose -f docker-compose-all.yaml up -d
cd ..

# starting different organizattions shell & creating channels

echo "==========starting different organizattions shell & creating channels========="

sleep 4

mfdPrdChannel(){
    echo "====== Creating shell for cli-manufacturer-1 & mfd-prd-channel =========="
    sudo docker exec -it cli-manufacturer-1 peer channel create -o orderer1.gov.io:7050 -c mfd-prd-channel -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/mfd-prd-channel.tx --outputBlock /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/mfd-prd-genesis.block --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem

    sleep 8

    echo "====== Joining channel by cli-manufacturer-1 ======"
    sudo docker exec -it cli-manufacturer-1 peer channel join -b /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/mfd-prd-genesis.block

    sleep 10

    sudo docker exec -it cli-manufacturer-1 peer channel update -o orderer1.gov.io:7050 --channelID mfd-prd-channel -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/mfd-anchor-1.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem

    sleep 8

    echo "========= Creating shell for cli-production-1 ==========="
    sudo docker exec -it cli-production-1 peer channel join -b /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/mfd-prd-genesis.block

    sleep 10

    sudo docker exec -it cli-production-1 peer channel update -o orderer1.gov.io:7050 --channelID mfd-prd-channel -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/prd-anchor-1.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem

    sleep 8
}

mfdWhsChannel(){
    # create channel mfd-whs-channel
    echo "create channel mfd-whs-channel"
    sudo docker exec -it cli-warehouse-1 peer channel create -o orderer1.gov.io:7050 -c mfd-whs-channel -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/mfd-whs-channel.tx --outputBlock /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/mfd-whs-genesis.block --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem

    sleep 8

    # Joining channel by manufacturer-2 peer
    echo "Joining channel by manufacturer-1 peer"
    sudo docker exec -it cli-manufacturer-1 peer channel join -b /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/mfd-whs-genesis.block

    sleep 10

    sudo docker exec -it cli-manufacturer-1 peer channel update -o orderer1.gov.io:7050 --channelID mfd-whs-channel -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/mfd-anchor-2.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem

    sleep 8

    # Joining whs-1 peer channel
    echo "Joining whs-1 peer channel"
    sudo docker exec -it cli-warehouse-1 peer channel join -b /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/mfd-whs-genesis.block

    sleep 10

    # update anchor peer
    sudo docker exec -it cli-warehouse-1 peer channel update -o orderer1.gov.io:7050 --channelID mfd-whs-channel -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/whs-anchor-1.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem

    sleep 8
}

whsRtlrChannel(){
    # create whs-rtlr channel
    echo "create whs-rtlr channel"
    sudo docker exec -it cli-warehouse-1 peer channel create -o orderer1.gov.io:7050 -c whs-rtlr-channel -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/whs-rtlr-channel.tx --outputBlock /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/whs-rtlr-genesis.block --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem

    sleep 10

    # Joining channel whs-2 peer
    echo "Joining channel whs-2 peer"
    sudo docker exec -it cli-warehouse-1 peer channel join -b /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/whs-rtlr-genesis.block
    sleep 10

    sudo docker exec -it cli-warehouse-1 peer channel update -o orderer1.gov.io:7050 --channelID whs-rtlr-channel -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/whs-anchor-2.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem

    sleep 8

    # Joining channel rtlr-1
    echo "Joining channel rtlr-1"
    sudo docker exec -it cli-retail-1 peer channel join -b /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/whs-rtlr-genesis.block
    sleep 10

    sudo docker exec -it cli-retail-1 peer channel update -o orderer1.gov.io:7050 --channelID whs-rtlr-channel -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/rtlr-anchor-1.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem

    sleep 8

}

# sudo docker-compose -f ./explorer/docker-compose-explorer.yaml up -d


# call the functiions here
mfdPrdChannel
mfdWhsChannel
whsRtlrChannel