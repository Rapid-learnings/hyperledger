#!/bin/bash

# for bringing docker env for persistent data up use  ./persist.sh up,
# for docker env for persistent data down use ./persist.sh down

echo $1

if [ $1 == up ]; then
    cd fabric-ca-client
    sudo docker-compose -f docker-compose.yaml up -d
    cd ..
    sudo docker-compose -f ./docker/docker-compose-all.yaml up -d
    sudo docker-compose -f ./explorer/docker-compose-explorer.yaml up -d
fi

# exit

if [ $1 == down ]; then
    cd fabric-ca-client
    sudo docker-compose -f docker-compose.yaml down --volumes
    sudo docker volume prune -f
    cd ..
    sudo docker-compose -f ./docker/docker-compose-all.yaml down --volumes
    sudo docker-compose -f ./explorer/docker-compose-explorer.yaml down -v
    sudo docker volume prune -f 
fi