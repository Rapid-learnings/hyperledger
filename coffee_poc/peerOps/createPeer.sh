#!/bin/sh

echo $1
echo 'Enter peer name'
read NAME
echo 'Enter peer secret'
read SECRET
# echo 'Enter peer ca port'
# read CAPORT
echo 'enter port for new peer'
read PORT
echo 'enter bootstrap peer address'
read BSPEER
echo 'enter chaincode port'
read CCPORT
echo 'enter couchdb port'
read DBPORT

if [ $1 = production ]; 
then
    MSPID='teafarmMSP'
    org="org1"
    CAPORT=2051
elif [ $1 = manufacturer ]; 
then
    MSPID='tataMSP'
    org="org2"
    CAPORT=2052
elif [ $1 = warehouse ]; 
then
    MSPID='tatastoreMSP'
    org="org3"
    CAPORT=2053
else
    MSPID='bigbazarMSP'
    org="org4"
    CAPORT=2054
fi

echo '+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++'
echo "Creating crypto material for $NAME.$1.com"
echo '+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++'

export FABRIC_CA_CLIENT_HOME=${PWD}/../crypto-config/peerOrganizations/$1.com/

echo
echo "Register $NAME"
echo

fabric-ca-client register --caname ca.$1.com --id.name $NAME --id.secret $SECRET --id.type peer --tls.certfiles ${PWD}/../fabric-ca-client/fabric-ca/$org/tls-cert.pem

mkdir -p ../crypto-config/peerOrganizations/$1.com/peers/$NAME.$1.com

echo
echo "## Generate the $NAME msp"
echo
fabric-ca-client enroll -u https://$NAME:$SECRET@localhost:$CAPORT --caname ca.$1.com -M ${PWD}/../crypto-config/peerOrganizations/$1.com/peers/$NAME.$1.com/msp --csr.hosts $NAME.$1.com --tls.certfiles ${PWD}/../fabric-ca-client/fabric-ca/$org/tls-cert.pem

cp ${PWD}/../crypto-config/peerOrganizations/$1.com/msp/config.yaml ${PWD}/../crypto-config/peerOrganizations/$1.com/peers/$NAME.$1.com/msp/config.yaml

echo
echo "## Generate the $NAME-tls certificates"
echo
fabric-ca-client enroll -u https://$NAME:$SECRET@localhost:$CAPORT --caname ca.$1.com -M ${PWD}/../crypto-config/peerOrganizations/$1.com/peers/$NAME.$1.com/tls --enrollment.profile tls --csr.hosts $NAME.$1.com --csr.hosts localhost --tls.certfiles ${PWD}/../fabric-ca-client/fabric-ca/$org/tls-cert.pem

cp ${PWD}/../crypto-config/peerOrganizations/$1.com/peers/$NAME.$1.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/$1.com/peers/$NAME.$1.com/tls/ca.crt
cp ${PWD}/../crypto-config/peerOrganizations/$1.com/peers/$NAME.$1.com/tls/signcerts/* ${PWD}/../crypto-config/peerOrganizations/$1.com/peers/$NAME.$1.com/tls/server.crt
cp ${PWD}/../crypto-config/peerOrganizations/$1.com/peers/$NAME.$1.com/tls/keystore/* ${PWD}/../crypto-config/peerOrganizations/$1.com/peers/$NAME.$1.com/tls/server.key

mkdir ${PWD}/../crypto-config/peerOrganizations/$1.com/peers/$NAME.$1.com/msp/tlscacerts
cp ${PWD}/../crypto-config/peerOrganizations/$1.com/peers/$NAME.$1.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/$1.com/peers/$NAME.$1.com/msp/tlscacerts/tlsca.$1.com-cert.pem

echo "
version: '2'

volumes:
    $NAME.$1.com:

networks:
    test:

services:
    $NAME.$1.com:
        image: hyperledger/fabric-peer:2.2
        dns_search: .
        container_name: $NAME.$1.com
        environment:
            - GODEBUG=netdns=go
            - CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
            - CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=docker_test
            - FABRIC_LOGGING_SPEC=INFO
            - CORE_PEER_TLS_ENABLED=true
            - CORE_PEER_GOSSIP_USELEADERELECTION=false
            - CORE_PEER_GOSSIP_ORGLEADER=true
            - CORE_PEER_PROFILE_ENABLED=true
            - CORE_PEER_TLS_CERT_FILE=/etc/hyperledger/fabric/tls/server.crt
            - CORE_PEER_TLS_KEY_FILE=/etc/hyperledger/fabric/tls/server.key
            - CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/tls/ca.crt
            - CORE_PEER_ID=$NAME.$1.com
            - CORE_PEER_ADDRESS=$NAME.$1.com:$PORT
            - CORE_PEER_LISTENADDRESS=0.0.0.0:$PORT
            - CORE_PEER_CHAINCODEADDRESS=$NAME.$1.com:$CCPORT
            - CORE_PEER_CHAINCODELISTENADDRESS=0.0.0.0:$CCPORT
            - CORE_PEER_GOSSIP_BOOTSTRAP=$BSPEER
            - CORE_PEER_GOSSIP_EXTERNALENDPOINT=$NAME.$1.com:$PORT
            - CORE_PEER_LOCALMSPID=$MSPID
            - CORE_LEDGER_STATE_STATEDATABASE=CouchDB
            - CORE_LEDGER_STATE_COUCHDBCONFIG_COUCHDBADDRESS=couchdb_$NAME.$1.com:5984
            - CORE_LEDGER_STATE_COUCHDBCONFIG_USERNAME=admin
            - CORE_LEDGER_STATE_COUCHDBCONFIG_PASSWORD=adminpw
            - CORE_METRICS_PROVIDER=prometheus
        volumes:
            - /var/run/:/host/var/run/
            - ../crypto-config/peerOrganizations/$1.com/peers/$NAME.$1.com/msp:/etc/hyperledger/fabric/msp
            - ../crypto-config/peerOrganizations/$1.com/peers/$NAME.$1.com/tls:/etc/hyperledger/fabric/tls
            - ../persistence-data/$NAME.$1.com:/var/hyperledger/$1
        ports:
            - $PORT:$PORT
        working_dir: /opt/gopath/src/github.com/hyperledger/fabric/peer
        command: peer node start
        networks:
            - test
        
    cli_$NAME.$1.com:
        container_name: cli_$NAME.$1.com
        image: hyperledger/fabric-tools:2.2
        tty: true
        stdin_open: true
        environment:
            - SYS_CHANNEL=orderer-channel
            - GOPATH=/opt/gopath
            - CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
            - FABRIC_LOGGING_SPEC=INFO
            - CORE_PEER_ID=$NAME.$1.com
            - CORE_PEER_ADDRESS=$NAME.$1.com:$PORT
            - CORE_PEER_LOCALMSPID=$MSPID
            - CORE_PEER_TLS_ENABLED=true
            - CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/$1.com/peers/$NAME.$1.com/tls/server.crt
            - CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/$1.com/peers/$NAME.$1.com/tls/server.key
            - CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/$1.com/peers/$NAME.$1.com/tls/ca.crt
            - CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/$1.com/users/Admin@$1.com/msp
        working_dir: /opt/gopath/src/github.com/hyperledger/fabric/peer
        command: /bin/bash
        volumes:
            - /var/run/:/host/var/run/
            - ../chaincode/:/opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode
            - ../crypto-config:/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/
            - ../:/opt/gopath/src/github.com/hyperledger/fabric/peer/scripts/
            - ../channel-artifacts:/opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts
        depends_on:
            - $NAME.$1.com
        networks:
            - test
        
    couchdb_$NAME.$1.com:
        container_name: couchdb_$NAME.$1.com
        image: couchdb:3.1.1
        environment:
            - COUCHDB_USER=admin
            - COUCHDB_PASSWORD=adminpw
        ports:
            - "$DBPORT:5984"
        networks:
            - test" >${PWD}/$NAME.yaml


echo '++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++'
echo "Launching container $NAME.$1.com"
echo '++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++'

export COMPOSE_PROJECT_NAME=docker
sudo docker-compose -f ./$NAME.yaml up -d