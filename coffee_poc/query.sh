#!/bin/sh

echo 'Enter peer ID'
read ID

# sudo docker exec -it cli-manufacturer-1 peer chaincode query --channelID mfd-prd-channel --name pmcc -c '{"Args":["getOrderDetails","1"]}'

sudo docker exec -it cli_$ID peer chaincode query --channelID mfd-prd-channel --name pmcc -c '{"Args":["getOrderDetails", "1"]}'


# sudo docker exec -it cli-manufacturer-1 peer chaincode query --channelID mfd-whs-channel --name mw -c '{"Args":["getWharehouseStock"]}'

# sudo docker exec -it cli-warehouse-1 peer chaincode query --channelID whs-rtlr-channel --name wrcc -c '{"Args":["getOrderDetails","1"]}'


# peer chaincode query --channelID pm-channel --name pmcc \
# -c '{"Args":["getManufacturerStock"]}'