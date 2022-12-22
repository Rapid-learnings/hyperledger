
sudo docker-compose -f ./docker/docker-compose-all.yaml down --volume

cd fabric-ca-client
sudo docker-compose -f docker-compose.yaml down --volume
cd ..

sudo docker volume prune -f