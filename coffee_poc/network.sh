#!/bin/sh
# set env variables in root directory where bin resides
export PATH=${PWD}/bin:$PATH
export FABRIC_CFG_PATH=${PWD}/config

rm -r -f ./channel-artifacts/*
# sudo chown $USER:$USER ./crypto-config
# sudo rm -r -f ./crypto-config
# create cryptogen material
createCryptogenMaterial(){
    echo "=========Creating Crypto Material========*"
    # cryptogen generate --config=${PWD}/crypto-config.yaml
    cd fabric-ca-client
    ./create-ca.sh
    cd ..
    sleep 5
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

    echo "*==================Creating Channel for Manufacturer & warehouse =================*"
    configtxgen -profile ManufacturerwarehouseProfile -outputCreateChannelTx ./channel-artifacts/mfd-whs-channel.tx -channelID mfd-whs-channel

    sleep 2

    echo "*==================Creating Channel for warehouse & Retailer =================*"
    configtxgen -profile warehouseRetailerProfile -outputCreateChannelTx ./channel-artifacts/whs-rtlr-channel.tx -channelID whs-rtlr-channel

    sleep 2

}


# 5. Create anchor peers according to different channels 
createAnchorPeers(){
    echo "*===========Creating the anchor peers for Manufacturer & Production=========*"
    configtxgen -profile ManufacturerProductionProfile -outputAnchorPeersUpdate ./channel-artifacts/prd-anchor-1.tx -channelID mfd-prd-channel -asOrg teafarm
    configtxgen -profile ManufacturerProductionProfile -outputAnchorPeersUpdate ./channel-artifacts/mfd-anchor-1.tx -channelID mfd-prd-channel -asOrg tata

    sleep 2

    echo "*===============Creating anchor peers for Manufacturer & warehouse===========*"
    configtxgen -profile ManufacturerwarehouseProfile -outputAnchorPeersUpdate ./channel-artifacts/mfd-anchor-2.tx -channelID mfd-whs-channel -asOrg tata
    configtxgen -profile ManufacturerwarehouseProfile -outputAnchorPeersUpdate ./channel-artifacts/whs-anchor-1.tx -channelID mfd-whs-channel -asOrg tatastore

    sleep 2

    echo "*================Creating anchor peers for warehouse & Retailer================================*"
    configtxgen -profile warehouseRetailerProfile -outputAnchorPeersUpdate ./channel-artifacts/whs-anchor-2.tx -channelID whs-rtlr-channel -asOrg tatastore
    configtxgen -profile warehouseRetailerProfile -outputAnchorPeersUpdate ./channel-artifacts/rtlr-anchor-1.tx -channelID whs-rtlr-channel -asOrg bigbazar

}


createCryptogenMaterial
createGenesis
createChannels
createAnchorPeers
