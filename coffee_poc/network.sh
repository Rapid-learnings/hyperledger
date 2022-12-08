#!/bin/sh
# set env variables in root directory where bin resides
export PATH=${PWD}/bin:$PATH
export FABRIC_CFG_PATH=${PWD}/config

rm -r -f ./channel-artifacts/*
# sudo chown $USER:$USER ./crypto-config
sudo rm -r -f ./crypto-config
# create cryptogen material
createCryptogenMaterial(){
    echo "=========Creating Crypto Material========*"
    cryptogen generate --config=${PWD}/crypto-config.yaml

    sleep 2
}

# 3. Create the genesis block, using the configtxgen & genesis profile
createGenesis(){
    echo "*===============Create the genesis block===================*"
    configtxgen --outputBlock ./channel-artifacts/genesis.block -profile GenesisProfile -channelID orderer-channel

    sleep 2
}

# 4. Create channel tx needs to be created for different org purposes
createChannels(){
    echo "*==================Creating Channel for Manufacturer & Production=================*"
    configtxgen -profile ManufacturerProductionProfile -outputCreateChannelTx ./channel-artifacts/mfd-prd-channel.tx -channelID mfd-prd-channel

    sleep 2

    echo "*==================Creating Channel for Manufacturer & Warehouse =================*"
    configtxgen -profile ManufacturerWarehouseProfile -outputCreateChannelTx ./channel-artifacts/mfd-whs-channel.tx -channelID mfd-whs-channel

    sleep 2

    echo "*==================Creating Channel for Warehouse & Retailer =================*"
    configtxgen -profile WarehouseRetailerProfile -outputCreateChannelTx ./channel-artifacts/whs-rtlr-channel.tx -channelID whs-rtlr-channel

    sleep 2

}


# 5. Create anchor peers according to different channels 
createAnchorPeers(){
 echo "*===========Creating the anchor peers for Manufacturer & Production=========*"
 configtxgen -profile ManufacturerProductionProfile -outputAnchorPeersUpdate ./channel-artifacts/tf-mfd-prd-anchor.tx -channelID mfd-prd-channel -asOrg teafarm
 configtxgen -profile ManufacturerProductionProfile -outputAnchorPeersUpdate ./channel-artifacts/tm-mfd-prd-anchor.tx -channelID mfd-prd-channel -asOrg tata

sleep 2

 echo "*===============Creating anchor peers for Manufacturer & Warehouse===========*"
configtxgen -profile ManufacturerWarehouseProfile -outputAnchorPeersUpdate ./channel-artifacts/tm-mfd-whs-anchor.tx -channelID mfd-whs-channel -asOrg tata
configtxgen -profile ManufacturerWarehouseProfile -outputAnchorPeersUpdate ./channel-artifacts/ts-mfd-whs-anchor.tx -channelID mfd-whs-channel -asOrg tatastore

sleep 2

echo "*================Creating anchor peers for Warehouse & Retailer================================*"
 configtxgen -profile WarehouseRetailerProfile -outputAnchorPeersUpdate ./channel-artifacts/ts-whs-rtlr-anchor.tx -channelID whs-rtlr-channel -asOrg tatastore
 configtxgen -profile WarehouseRetailerProfile -outputAnchorPeersUpdate ./channel-artifacts/bb-whs-rtlr-anchor.tx -channelID whs-rtlr-channel -asOrg bigbazar

}


createCryptogenMaterial
createGenesis
createChannels
createAnchorPeers
