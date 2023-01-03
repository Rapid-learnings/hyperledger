export PATH=${PWD}../bin:$PATH
export FABRIC_CFG_PATH=${PWD}/../config

if [ $1 == down ]; then
    sudo docker-compose -f ./docker/docker-compose-ca.yaml down --volumes

    sleep 2

    sudo docker-compose -f ./docker/docker-compose-peer.yaml down --volumes

    sleep 2

    sudo docker volume prune -f
fi

if [ $1 == up ]; then
    sudo docker-compose -f ./docker/docker-compose-ca.yaml up -d

    sleep 5

    ./create-ca-new-org.sh

    sleep 5

    sudo docker-compose -f ./docker/docker-compose-peer.yaml up -d

    sleep 5

fi