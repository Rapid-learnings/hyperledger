# set env variables in root directory where bin resides
export PATH=${PWD}/bin:$PATH
export FABRIC_CFG_PATH=${PWD}/config

rm -r -f ./channel-artefacts/*
# sudo chown $USER:$USER ./crypto-config
sudo rm -r -f ./crypto-config
# create cryptogen material
createCryptogenMaterial(){
    echo "=========Creating Crypto Material========\n"
    cryptogen generate --config=${PWD}/crypto-config.yaml

    sleep 2
}

# 3. Create the genesis block, using the configtxgen & genesis profile
createGenesis(){
    echo "\n===============Create the genesis block===================\n"
    configtxgen --outputBlock ./channel-artefacts/genesis.block -profile GenesisProfile -channelID orderer-channel

    sleep 2
}

# 4. Create channel tx needs to be created for different org purposes
createChannels(){
    echo "\n==================Creating Channel for Manufacturer & Production=================\n"
    configtxgen -profile ManufacturerProductionProfile -outputCreateChannelTx ./channel-artefacts/mfd-prd-channel.tx -channelID mfd-prd-channel

    sleep 2

    echo "\n==================Creating Channel for Manufacturer & Wharehouse =================\n"
    configtxgen -profile ManufacturerWharehouseProfile -outputCreateChannelTx ./channel-artefacts/mfd-whs-channel.tx -channelID mfd-whs-channel

    sleep 2

    echo "\n==================Creating Channel for Wharehouse & Retailer =================\n"
    configtxgen -profile WharehouseRetailerProfile -outputCreateChannelTx ./channel-artefacts/whs-rtlr-channel.tx -channelID whs-rtlr-channel

    sleep 2

}


# 5. Create anchor peers according to different channels 
createAnchorPeers(){
 echo "\n===========Creating the anchor peers for Manufacturer & Production=========\n"
 configtxgen -profile ManufacturerProductionProfile -outputAnchorPeersUpdate ./channel-artefacts/mfd-prd-anchor.tx -channelID mfd-prd-channel -asOrg teafarm
 configtxgen -profile ManufacturerProductionProfile -outputAnchorPeersUpdate ./channel-artefacts/mfd-prd-anchor.tx -channelID mfd-prd-channel -asOrg tata

sleep 2

 echo "\n===============Creating anchor peers for Manufacturer & Wharehouse===========\n"
configtxgen -profile ManufacturerWharehouseProfile -outputAnchorPeersUpdate ./channel-artefacts/mfd-whs-anchor.tx -channelID mfd-whs-channel -asOrg tata
configtxgen -profile ManufacturerWharehouseProfile -outputAnchorPeersUpdate ./channel-artefacts/mfd-whs-anchor.tx -channelID mfd-whs-channel -asOrg tatastore

sleep 2

echo "\n================Creating anchor peers for Wharehouse & Retailer================================\n"
 configtxgen -profile WharehouseRetailerProfile -outputAnchorPeersUpdate ./channel-artefacts/whs-rtlr-anchor.tx -channelID whs-rtlr-channel -asOrg tatastore
 configtxgen -profile WharehouseRetailerProfile -outputAnchorPeersUpdate ./channel-artefacts/whs-rtlr-anchor.tx -channelID whs-rtlr-channel -asOrg bigbazar

}


createCryptogenMaterial
createGenesis
createChannels
createAnchorPeers
