sudo docker-compose -f ./docker/docker-compose-all.yaml down --volumes
sudo docker-compose -f ./fabric-ca-client/docker-compose.yaml down --volumes
sudo docker volume prune -f