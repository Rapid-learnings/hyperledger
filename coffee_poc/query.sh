#!/bin/sh

# sudo docker exec -it cli-manufacturer-1 peer chaincode query --channelID mfd-prd-channel --name mfcprd -c '{"Args":["availableStock"]}'


# sudo docker exec -it cli-manufacturer-1 peer chaincode query --channelID mfd-whs-channel --name mw -c '{"Args":["getWharehouseStock"]}'

sudo docker exec -it cli-wharehouse-1 peer chaincode query --channelID whs-rtlr-channel --name wr -c '{"Args":["returnWarehouseSTockAccordingToMWCC"]}'


# peer chaincode query --channelID pm-channel --name pmcc \
# -c '{"Args":["getManufacturerStock"]}'