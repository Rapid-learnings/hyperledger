
sudo docker-compose -f ./docker/docker-compose-all.yaml down -v
sudo docker-compose -f ./explorer/docker-compose-explorer.yaml down -v

cd fabric-ca-client
sudo docker-compose -f docker-compose.yaml down -v
sudo docker volume prune -f
cd ..

sudo docker volume prune -f