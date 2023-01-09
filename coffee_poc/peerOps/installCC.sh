#!/bin/sh

echo 'enter peer ID'
read ID
echo 'enter chaincode name'
read CCNAME

sudo docker exec -it cli_$ID peer lifecycle chaincode install ./chaincode/$CCNAME.tar.gz
