export FABRIC_CFG_PATH=${PWD}/../config
export PATH=${PWD}/../bin:$PATH

# this function generates crypto-material for new org
createCryptoForNewOrg(){
# Enroll CA

    echo
    echo "Enroll CA ADMIN"
    echo

    mkdir -p  ../crypto-config/peerOrganizations/safety.io/
    sudo chmod 777 ../crypto-config/peerOrganizations/safety.io/

    export FABRIC_CA_CLIENT_HOME=${PWD}/../crypto-config/peerOrganizations/safety.io

    fabric-ca-client enroll -u https://admin:adminpw@localhost:2056 --caname ca.safety.io --tls.certfiles ${PWD}/fabric-ca/fssai/tls-cert.pem

    echo 'NodeOUs:
    Enable: true
    ClientOUIdentifier:
        Certificate: cacerts/localhost-2056-ca-safety-io.pem
        OrganizationalUnitIdentifier: client
    PeerOUIdentifier:
        Certificate: cacerts/localhost-2056-ca-safety-io.pem
        OrganizationalUnitIdentifier: peer
    AdminOUIdentifier:
        Certificate: cacerts/localhost-2056-ca-safety-io.pem
        OrganizationalUnitIdentifier: admin
    OrdererOUIdentifier: 
        Certificate: cacerts/localhost-2056-ca-safety-io.pem
        OrganizationalUnitIdentifier: orderer' >${PWD}/../crypto-config/peerOrganizations/safety.io/msp/config.yaml

    echo
    echo "Register Peer 1 For FSSAI"
    echo

    fabric-ca-client register --caname ca.safety.io --id.name peerfssai1 --id.secret peerfssaipwd --id.type peer --tls.certfiles ${PWD}/fabric-ca/fssai/tls-cert.pem

    echo
    echo "Register user"
    echo 

    fabric-ca-client register --caname ca.safety.io --id.name user1 --id.secret userpwd --id.type client --tls.certfiles ${PWD}/fabric-ca/fssai/tls-cert.pem

    echo
    echo "Register the org admin"
    echo

    fabric-ca-client register --caname ca.safety.io --id.name fssaiadmin --id.secret adminpw --id.type admin --tls.certfiles ${PWD}/fabric-ca/fssai/tls-cert.pem

    mkdir -p ../crypto-config/peerOrganizations/safety.io/peers
    mkdir -p ../crypto-config/peerOrganizations/safety.io/peers/peerfssai1.safety.io
    mkdir -p ../crypto-config/peerOrganizations/safety.io/peers/peerfssai1.safety.io/tls
    
    sudo chmod 777 ../crypto-config/peerOrganizations/safety.io/peers/peerfssai1.safety.io/tls
    
    mkdir ${PWD}/../crypto-config/peerOrganizations/safety.io/peers/peerfssai1.safety.io/msp
    sudo chmod 777 ${PWD}/../crypto-config/peerOrganizations/safety.io/peers/peerfssai1.safety.io/msp

    echo
    echo "## Generate the peerfssai1 msp"
    echo

    fabric-ca-client enroll -u https://peerfssai1:peerfssaipwd@localhost:2056 --caname ca.safety.io -M ${PWD}/../crypto-config/peerOrganizations/safety.io/peers/peerfssai1.safety.io/msp --csr.hosts peerfssai1.safety.io --tls.certfiles ${PWD}/fabric-ca/fssai/tls-cert.pem

    cp ${PWD}/../crypto-config/peerOrganizations/safety.io/msp/config.yaml ${PWD}/../crypto-config/peerOrganizations/safety.io/peers/peerfssai1.safety.io/msp/config.yaml

    echo
    echo "## Generate the peerfssai1-tls certificates"
    echo    

    fabric-ca-client enroll -u https://peerfssai1:peerfssaipwd@localhost:2056 --caname ca.safety.io -M ${PWD}/../crypto-config/peerOrganizations/safety.io/peers/peerfssai1.safety.io/tls --enrollment.profile tls --csr.hosts peerfssai1.safety.io --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/fssai/tls-cert.pem
    
    cp ${PWD}/../crypto-config/peerOrganizations/safety.io/peers/peerfssai1.safety.io/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/safety.io/peers/peerfssai1.safety.io/tls/ca.crt
    cp ${PWD}/../crypto-config/peerOrganizations/safety.io/peers/peerfssai1.safety.io/tls/signcerts/* ${PWD}/../crypto-config/peerOrganizations/safety.io/peers/peerfssai1.safety.io/tls/server.crt
    cp ${PWD}/../crypto-config/peerOrganizations/safety.io/peers/peerfssai1.safety.io/tls/keystore/* ${PWD}/../crypto-config/peerOrganizations/safety.io/peers/peerfssai1.safety.io/tls/server.key

    mkdir -p ${PWD}/../crypto-config/peerOrganizations/safety.io/msp/tlscacerts
    cp ${PWD}/../crypto-config/peerOrganizations/safety.io/peers/peerfssai1.safety.io/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/safety.io/msp/tlscacerts/ca.crt

    mkdir -p ${PWD}/../crypto-config/peerOrganizations/safety.io/tlsca
    cp ${PWD}/../crypto-config/peerOrganizations/safety.io/peers/peerfssai1.safety.io/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/safety.io/tlsca/tlsca.safety.io-cert.pem

    mkdir -p ${PWD}/../crypto-config/peerOrganizations/safety.io/peers/peerfssai1.safety.io/msp/tlscacerts
    cp ${PWD}/../crypto-config/peerOrganizations/safety.io/peers/peerfssai1.safety.io/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/safety.io/peers/peerfssai1.safety.io/msp/tlscacerts/tlsca.safety.io-cert.pem

    mkdir -p ${PWD}/../crypto-config/peerOrganizations/safety.io/ca
    cp ${PWD}/../crypto-config/peerOrganizations/safety.io/peers/peerfssai1.safety.io/msp/cacerts/* ${PWD}/../crypto-config/peerOrganizations/safety.io/ca/ca.safety.io-cert.pem

    mkdir -p ../crypto-config/peerOrganizations/safety.io/users
    mkdir -p ../crypto-config/peerOrganizations/safety.io/users/User1@safety.io

    echo
    echo "## Generate the user msp"
    echo
    
    fabric-ca-client enroll -u https://user1:userpwd@localhost:2056 --caname ca.safety.io -M ${PWD}/../crypto-config/peerOrganizations/safety.io/users/User1@safety.io/msp --tls.certfiles ${PWD}/fabric-ca/fssai/tls-cert.pem
    

    mkdir -p ../crypto-config/peerOrganizations/safety.io/users/Admin@safety.io

    echo
    echo "## Generate the org admin msp"
    echo
    
    fabric-ca-client enroll -u https://fssaiadmin:adminpw@localhost:2056 --caname ca.safety.io -M ${PWD}/../crypto-config/peerOrganizations/safety.io/users/Admin@safety.io/msp --tls.certfiles ${PWD}/fabric-ca/fssai/tls-cert.pem
    

    cp ${PWD}/../crypto-config/peerOrganizations/safety.io/msp/config.yaml ${PWD}/../crypto-config/peerOrganizations/safety.io/users/Admin@safety.io/msp/config.yaml

    mv ${PWD}/../crypto-config/peerOrganizations/safety.io/users/Admin@safety.io/msp/keystore/* ${PWD}/../crypto-config/peerOrganizations/safety.io/users/Admin@safety.io/msp/keystore/priv_sk

}


createCryptoForNewOrg