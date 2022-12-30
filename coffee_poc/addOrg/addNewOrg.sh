export PATH=${PWD}../bin:$PATH
export FABRIC_CFG_PATH=${PWD}/../config

sudo docker-compose -f ./docker/docker-compose-ca.yaml up -d

sleep 2

sudo docker-compose -f ./docker/docker-compose-peer.yaml up -d

sleep 2

./create-ca-new-org.sh

