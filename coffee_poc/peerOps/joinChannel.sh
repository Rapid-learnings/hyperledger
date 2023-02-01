#!/bin/sh

echo 'Enter org name'
read ORG_NAME
echo 'Enter peer id'
read ID
echo 'Enter peers port'
read PORT
echo 'Enter channel name'
read CHANNEL_NAME
echo 'Want to submit as anchor peer (y/n)'
read res

ORDERER_CA="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem"

if [ $CHANNEL_NAME = mfd-prd-channel ]; 
then
    GENESIS=mfd-prd-genesis.block
elif [ $CHANNEL_NAME = mfd-whs-channel ]; 
then
    GENESIS=mfd-whs-genesis.block
elif [ $CHANNEL_NAME = whs-rtlr-channel ]; 
then
    GENESIS=whs-rtlr-genesis.block
else    
    exit 'Incorrect channel name'
    exit
fi

echo "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
echo "Joining peer $ID to $CHANNEL_NAME by genesis block"
echo "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"

sudo docker exec -it cli_$ID peer channel join -b ./channel-artifacts/$GENESIS

sleep 6

if [ $res = y ]; 
then
    echo "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
    echo "Updating Anchors for peer $ID in $CHANNEL_NAME"
    echo "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"

    sudo docker exec -it cli_$ID ./scripts/anchor.sh $CHANNEL_NAME $ID $ORG_NAME $PORT $ORDERER_CA
    #                                                    1          2     3     4       5

    echo 'Sign the transaction and send'
    sudo docker exec -it cli_$ID peer channel signconfigtx -f ./channel-artifacts/anchor_update_in_envelope.pb
    sudo docker exec -it cli_$ID peer channel update -f ./channel-artifacts/anchor_update_in_envelope.pb -c $CHANNEL_NAME -o orderer1.gov.io:7050 --tls --cafile $ORDERER_CA
fi