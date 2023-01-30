add a .env file with the COMPOSE_PROJECT_NAME variable pointing to the name of the network. This is done so that newly launched peers will be on the same bridge network

when executing createPeer.sh script make sure to give one argument which is the level of the organisation whether production, retailer etc
Ex.     ./createPeer.sh production