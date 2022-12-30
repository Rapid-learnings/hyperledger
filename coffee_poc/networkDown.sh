sudo docker-compose -f ./docker/docker-compose-all.yaml down -v
sudo docker-compose -f ./fabric-ca-client/docker-compose.yaml down -v
sudo docker-compose -f ./explorer/docker-compose.yaml down -v
sudo docker volume prune -f