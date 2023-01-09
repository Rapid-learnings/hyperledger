#!/bin/sh
export FABRIC_CFG_PATH=$PWD
configtxgen -profile Genesis -outputBlock ./channel-artifacts/genesis.block -channelID poc-system-channel

configtxgen -profile PMChannel -outputCreateChannelTx ./channel-artifacts/pm-channel.tx -channelID pm-channel
configtxgen -profile MWChannel -outputCreateChannelTx ./channel-artifacts/mw-channel.tx -channelID mw-channel 
configtxgen -profile WRChannel -outputCreateChannelTx ./channel-artifacts/wr-channel.tx -channelID wr-channel 

configtxgen -profile PMChannel -outputAnchorPeersUpdate ./channel-artifacts/ProducerMSP_pm_anchor.tx -channelID pm-channel -asOrg ProducerMSP
configtxgen -profile PMChannel -outputAnchorPeersUpdate ./channel-artifacts/ManufacturerMSP_pm_anchor.tx -channelID pm-channel -asOrg ManufacturerMSP

configtxgen -profile MWChannel -outputAnchorPeersUpdate ./channel-artifacts/ManufacturerMSP_mw_anchor.tx -channelID mw-channel -asOrg ManufacturerMSP
configtxgen -profile MWChannel -outputAnchorPeersUpdate ./channel-artifacts/WarehouseMSP_mw_anchor.tx -channelID mw-channel -asOrg WarehouseMSP

configtxgen -profile WRChannel -outputAnchorPeersUpdate ./channel-artifacts/WarehouseMSP_wr_anchor.tx -channelID wr-channel -asOrg WarehouseMSP
configtxgen -profile WRChannel -outputAnchorPeersUpdate ./channel-artifacts/RetailerMSP_wr_anchor.tx -channelID wr-channel -asOrg RetailerMSP

configtxgen -profile PMChannel -outputAnchorPeersUpdate ./channel-artifacts/GovMSP_pm_anchor.tx -channelID pm-channel -asOrg GovMSP
configtxgen -profile MWChannel -outputAnchorPeersUpdate ./channel-artifacts/GovMSP_mw_anchor.tx -channelID mw-channel -asOrg GovMSP
configtxgen -profile WRChannel -outputAnchorPeersUpdate ./channel-artifacts/GovMSP_wr_anchor.tx -channelID wr-channel -asOrg GovMSP