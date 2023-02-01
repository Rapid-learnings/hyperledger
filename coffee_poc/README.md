# Coffee POC

> Note : This repo uses fabric binaries & docker images of version 2.2

### This POC has 4 organizations
1. **teafarm** : works as producer
2. **tata** : works as manufacturer
3. **tatastore** : works as warehouse
4. **bigbazar** : works as retail seller

![](/home/ubuntu/fabric/hyperledger/coffee_poc/assets/mermaid-diagram-2023-01-31-133719.png)

### About POC ###

Here in this POC we have built and deployed nodes for a total of five organisations :-
1. **teafarm** : works as producer
2. **tata** : works as manufacturer
3. **tatastore** : works as warehouse
4. **bigbazar** : works as retail seller
5. **governance** : works as government regulator

here the first 4 organisations runs peer nodes while the government organisation runs the orderer nodes. the nodes in the network can transact with each other through their specified channels that have been implemented:-
1. **mfd-prd-channel** : channel between the producer and manufacturer
2. **mfd-whs-channel** : channel between the producer and warehouse
3. **whs-rtlr-channel** : channel between the warehouse and retailer

there also exists by default the system channel called 'orderer-channel' which contains the orderer nodes and the Consortium organisation. In Fabric only members of a certain Consortium can create channels.

### Steps to run the network ###

In order to run the network run the ./run.sh script on the terminal. This will do multiple operations:
1. Start the CA servers and create crypto materials.
2. Deploy peer and orderer nodes with their state db's and cli's.
3. Create and join the respective organisations to their respective channels and update anchor peers.
4. Deploy and initalise chaincodes on each channel.

To run explorer 
cd explorer
sudo docker-compose up
login and password for each org can be found under adminCredential inside the json file inside the organisations config folder

### FABRIC-CA ###

In order to generate certificates for the peers and organisations as a whole we must set up the Certificate Authorities for each organisation.

Each organisation must have atleast 2 CAs
    - an Enrollment CA
    - a TLS CA

The Enrollment CA is responsible for the generation of IDs that are consumed by the Membersip service providers (MSP) and the TLS CA is used to generate the tls certificates for the cross peer communication and tls handshakes.

Within the scripts that generate the certificates we first define the the CA server specs in yaml and launch it as a docker container. We then pass the required commands to register thr CA admin (already bootstrapped to the CA, so no need to enroll) then we need to enroll and register the peers, users and organisational admins

### Building the Network ###

The building of the network consists of 4 steps:
1. Generating crypto materials using a Certificate Authority
2. Creating the artifacts for the Genesis block for the system channel and peer channels and achor peer transactions
3. writing the yaml configuration for the docker containers running the peer and orderer nodes and deploying using docker-compose
4. Once the containers are up use the genesis block artifacts to start and join the each peer to their respective channel and update anchor peers using the peer cli

### Deploying ChainCodes ###

Now the network is up and running but we must install the necessary chaincodes to the peers of the concerned channels

Steps to deploy the chaincode:
1. package chaincode into a tar.gz file, this can be done by one or all orgs in the respective channel.
2. install the tar file in each of the peer nodes
3. Once all the peers have installed the chaincode each org must approve the chaincode
4. Once all the approvals have been given the chaincode is ready to be committed by the nodes
5. after commiting the chaincodes it must be initialised by any of the channel members.

Chaincodes are successfully deployed on the channels.

