export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=${PWD}/../config

createcertificatesForOrg1() {
  echo
  echo "Enroll the CA admin"
  echo
  mkdir -p ../crypto-config/peerOrganizations/production.com/
  export FABRIC_CA_CLIENT_HOME=${PWD}/../crypto-config/peerOrganizations/production.com/

   
  fabric-ca-client enroll -u https://admin:adminpw@localhost:2051 --caname ca.production.com --tls.certfiles ${PWD}/fabric-ca/org1/tls-cert.pem
   

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-2051-ca-production-com.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-2051-ca-production-com.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-2051-ca-production-com.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-2051-ca-production-com.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/../crypto-config/peerOrganizations/production.com/msp/config.yaml

  echo
  echo "Register peer0"
  echo
  fabric-ca-client register --caname ca.production.com --id.name peertf1 --id.secret peertf1pw --id.type peer --tls.certfiles ${PWD}/fabric-ca/org1/tls-cert.pem

  echo
  echo "Register peer1"
  echo
  fabric-ca-client register --caname ca.production.com --id.name peertf2 --id.secret peertf2pw --id.type peer --tls.certfiles ${PWD}/fabric-ca/org1/tls-cert.pem

  echo
  echo "Register user"
  echo
  fabric-ca-client register --caname ca.production.com --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/fabric-ca/org1/tls-cert.pem

  echo
  echo "Register the org admin"
  echo
  fabric-ca-client register --caname ca.production.com --id.name org1admin --id.secret org1adminpw --id.type admin --tls.certfiles ${PWD}/fabric-ca/org1/tls-cert.pem

  mkdir -p ../crypto-config/peerOrganizations/production.com/peers

  # -----------------------------------------------------------------------------------
  #  Peer tf1
  mkdir -p ../crypto-config/peerOrganizations/production.com/peers/peertf1.production.com

  echo
  echo "## Generate the peertf1 msp"
  echo
  fabric-ca-client enroll -u https://peertf1:peertf1pw@localhost:2051 --caname ca.production.com -M ${PWD}/../crypto-config/peerOrganizations/production.com/peers/peertf1.production.com/msp --csr.hosts peertf1.production.com --tls.certfiles ${PWD}/fabric-ca/org1/tls-cert.pem

  cp ${PWD}/../crypto-config/peerOrganizations/production.com/msp/config.yaml ${PWD}/../crypto-config/peerOrganizations/production.com/peers/peertf1.production.com/msp/config.yaml

  echo
  echo "## Generate the peertf1-tls certificates"
  echo
  fabric-ca-client enroll -u https://peertf1:peertf1pw@localhost:2051 --caname ca.production.com -M ${PWD}/../crypto-config/peerOrganizations/production.com/peers/peertf1.production.com/tls --enrollment.profile tls --csr.hosts peertf1.production.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/org1/tls-cert.pem

  cp ${PWD}/../crypto-config/peerOrganizations/production.com/peers/peertf1.production.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/production.com/peers/peertf1.production.com/tls/ca.crt
  cp ${PWD}/../crypto-config/peerOrganizations/production.com/peers/peertf1.production.com/tls/signcerts/* ${PWD}/../crypto-config/peerOrganizations/production.com/peers/peertf1.production.com/tls/server.crt
  cp ${PWD}/../crypto-config/peerOrganizations/production.com/peers/peertf1.production.com/tls/keystore/* ${PWD}/../crypto-config/peerOrganizations/production.com/peers/peertf1.production.com/tls/server.key

  mkdir ${PWD}/../crypto-config/peerOrganizations/production.com/msp/tlscacerts
  cp ${PWD}/../crypto-config/peerOrganizations/production.com/peers/peertf1.production.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/production.com/msp/tlscacerts/ca.crt

  mkdir ${PWD}/../crypto-config/peerOrganizations/production.com/tlsca
  cp ${PWD}/../crypto-config/peerOrganizations/production.com/peers/peertf1.production.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/production.com/tlsca/tlsca.production.com-cert.pem

  mkdir ${PWD}/../crypto-config/peerOrganizations/production.com/peers/peertf1.production.com/msp/tlscacerts
  cp ${PWD}/../crypto-config/peerOrganizations/production.com/peers/peertf1.production.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/production.com/peers/peertf1.production.com/msp/tlscacerts/tlsca.production.com-cert.pem

  mkdir ${PWD}/../crypto-config/peerOrganizations/production.com/ca
  cp ${PWD}/../crypto-config/peerOrganizations/production.com/peers/peertf1.production.com/msp/cacerts/* ${PWD}/../crypto-config/peerOrganizations/production.com/ca/ca.production.com-cert.pem

  # --------------------------------------------------------------------------------------------------
  # Peer tf2
  echo
  echo "## Generate the peertf2 msp"
  echo
  fabric-ca-client enroll -u https://peertf2:peertf2pw@localhost:2051 --caname ca.production.com -M ${PWD}/../crypto-config/peerOrganizations/production.com/peers/peertf2.production.com/msp --csr.hosts peertf2.production.com --tls.certfiles ${PWD}/fabric-ca/org1/tls-cert.pem

  cp ${PWD}/../crypto-config/peerOrganizations/production.com/msp/config.yaml ${PWD}/../crypto-config/peerOrganizations/production.com/peers/peertf2.production.com/msp/config.yaml

  echo
  echo "## Generate the peertf2-tls certificates"
  echo
  fabric-ca-client enroll -u https://peertf2:peertf2pw@localhost:2051 --caname ca.production.com -M ${PWD}/../crypto-config/peerOrganizations/production.com/peers/peertf2.production.com/tls --enrollment.profile tls --csr.hosts peertf2.production.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/org1/tls-cert.pem

  cp ${PWD}/../crypto-config/peerOrganizations/production.com/peers/peertf2.production.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/production.com/peers/peertf2.production.com/tls/ca.crt
  cp ${PWD}/../crypto-config/peerOrganizations/production.com/peers/peertf2.production.com/tls/signcerts/* ${PWD}/../crypto-config/peerOrganizations/production.com/peers/peertf2.production.com/tls/server.crt
  cp ${PWD}/../crypto-config/peerOrganizations/production.com/peers/peertf2.production.com/tls/keystore/* ${PWD}/../crypto-config/peerOrganizations/production.com/peers/peertf2.production.com/tls/server.key

  # mkdir ${PWD}/../crypto-config/peerOrganizations/production.com/msp/tlscacerts
  cp ${PWD}/../crypto-config/peerOrganizations/production.com/peers/peertf2.production.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/production.com/msp/tlscacerts/ca.crt

  # mkdir ${PWD}/../crypto-config/peerOrganizations/production.com/tlsca
  cp ${PWD}/../crypto-config/peerOrganizations/production.com/peers/peertf2.production.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/production.com/tlsca/tlsca.production.com-cert.pem

  mkdir ${PWD}/../crypto-config/peerOrganizations/production.com/peers/peertf2.production.com/msp/tlscacerts
  cp ${PWD}/../crypto-config/peerOrganizations/production.com/peers/peertf2.production.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/production.com/peers/peertf2.production.com/msp/tlscacerts/tlsca.production.com-cert.pem

  # mkdir ${PWD}/../crypto-config/peerOrganizations/production.com/ca
  cp ${PWD}/../crypto-config/peerOrganizations/production.com/peers/peertf2.production.com/msp/cacerts/* ${PWD}/../crypto-config/peerOrganizations/production.com/ca/ca.production.com-cert.pem
  # --------------------------------------------------------------------------------------------------

  mkdir -p ../crypto-config/peerOrganizations/production.com/users
  mkdir -p ../crypto-config/peerOrganizations/production.com/users/User1@production.com

  echo
  echo "## Generate the user msp"
  echo
  fabric-ca-client enroll -u https://user1:user1pw@localhost:2051 --caname ca.production.com -M ${PWD}/../crypto-config/peerOrganizations/production.com/users/User1@production.com/msp --tls.certfiles ${PWD}/fabric-ca/org1/tls-cert.pem

  mkdir -p ../crypto-config/peerOrganizations/production.com/users/Admin@production.com

  echo
  echo "## Generate the org admin msp"
  echo
  fabric-ca-client enroll -u https://org1admin:org1adminpw@localhost:2051 --caname ca.production.com -M ${PWD}/../crypto-config/peerOrganizations/production.com/users/Admin@production.com/msp --tls.certfiles ${PWD}/fabric-ca/org1/tls-cert.pem

  cp ${PWD}/../crypto-config/peerOrganizations/production.com/msp/config.yaml ${PWD}/../crypto-config/peerOrganizations/production.com/users/Admin@production.com/msp/config.yaml

}

# createcertificatesForOrg1

createCertificatesForOrg2() {
  echo
  echo "Enroll the CA admin"
  echo
  mkdir -p /../crypto-config/peerOrganizations/manufacturer.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/../crypto-config/peerOrganizations/manufacturer.com/

   
  fabric-ca-client enroll -u https://admin:adminpw@localhost:2052 --caname ca.manufacturer.com --tls.certfiles ${PWD}/fabric-ca/org2/tls-cert.pem
   

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-2052-ca-manufacturer-com.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-2052-ca-manufacturer-com.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-2052-ca-manufacturer-com.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-2052-ca-manufacturer-com.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/../crypto-config/peerOrganizations/manufacturer.com/msp/config.yaml

  echo
  echo "Register peertm1"
  echo
   
  fabric-ca-client register --caname ca.manufacturer.com --id.name peertm1 --id.secret peertm1pw --id.type peer --tls.certfiles ${PWD}/fabric-ca/org2/tls-cert.pem

  echo
  echo "Register peertm2"
  echo
   
  fabric-ca-client register --caname ca.manufacturer.com --id.name peertm2 --id.secret peertm2pw --id.type peer --tls.certfiles ${PWD}/fabric-ca/org2/tls-cert.pem
   

  echo
  echo "Register user"
  echo
   
  fabric-ca-client register --caname ca.manufacturer.com --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/fabric-ca/org2/tls-cert.pem
   

  echo
  echo "Register the org admin"
  echo
   
  fabric-ca-client register --caname ca.manufacturer.com --id.name org2admin --id.secret org2adminpw --id.type admin --tls.certfiles ${PWD}/fabric-ca/org2/tls-cert.pem
   

  mkdir -p ../crypto-config/peerOrganizations/manufacturer.com/peers
  mkdir -p ../crypto-config/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com

  # --------------------------------------------------------------
  # Peer tm1
  echo
  echo "## Generate the peertm1 msp"
  echo
   
  fabric-ca-client enroll -u https://peertm1:peertm1pw@localhost:2052 --caname ca.manufacturer.com -M ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/msp --csr.hosts peertm1.manufacturer.com --tls.certfiles ${PWD}/fabric-ca/org2/tls-cert.pem
   

  cp ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/msp/config.yaml ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/msp/config.yaml

  echo
  echo "## Generate the peertm1-tls certificates"
  echo
   
  fabric-ca-client enroll -u https://peertm1:peertm1pw@localhost:2052 --caname ca.manufacturer.com -M ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls --enrollment.profile tls --csr.hosts peertm1.manufacturer.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/org2/tls-cert.pem
   

  cp ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/ca.crt
  cp ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/signcerts/* ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/server.crt
  cp ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/keystore/* ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/server.key

  mkdir ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/msp/tlscacerts
  cp ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/msp/tlscacerts/ca.crt

  mkdir ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/tlsca
  cp ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/tlsca/tlsca.manufacturer.com-cert.pem

  mkdir ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/msp/tlscacerts
  cp ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/msp/tlscacerts/tlsca.manufacturer.com-cert.pem

  mkdir ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/ca
  cp ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/peers/peertm1.manufacturer.com/msp/cacerts/* ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/ca/ca.manufacturer.com-cert.pem

  # --------------------------------------------------------------------------------
  # Peer tm2
  echo
  echo "## Generate the peertm2 msp"
  echo
   
  fabric-ca-client enroll -u https://peertm2:peertm2pw@localhost:2052 --caname ca.manufacturer.com -M ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/peers/peertm2.manufacturer.com/msp --csr.hosts peertm2.manufacturer.com --tls.certfiles ${PWD}/fabric-ca/org2/tls-cert.pem
   

  cp ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/msp/config.yaml ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/peers/peertm2.manufacturer.com/msp/config.yaml

  echo
  echo "## Generate the peertm2-tls certificates"
  echo
   
  fabric-ca-client enroll -u https://peertm2:peertm2pw@localhost:2052 --caname ca.manufacturer.com -M ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/peers/peertm2.manufacturer.com/tls --enrollment.profile tls --csr.hosts peertm2.manufacturer.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/org2/tls-cert.pem
   

  cp ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/peers/peertm2.manufacturer.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/peers/peertm2.manufacturer.com/tls/ca.crt
  cp ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/peers/peertm2.manufacturer.com/tls/signcerts/* ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/peers/peertm2.manufacturer.com/tls/server.crt
  cp ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/peers/peertm2.manufacturer.com/tls/keystore/* ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/peers/peertm2.manufacturer.com/tls/server.key

  # mkdir ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/msp/tlscacerts
  cp ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/peers/peertm2.manufacturer.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/msp/tlscacerts/ca.crt

  # mkdir ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/tlsca
  cp ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/peers/peertm2.manufacturer.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/tlsca/tlsca.manufacturer.com-cert.pem

  mkdir ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/peers/peertm2.manufacturer.com/msp/tlscacerts
  cp ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/peers/peertm2.manufacturer.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/peers/peertm2.manufacturer.com/msp/tlscacerts/tlsca.manufacturer.com-cert.pem

  # mkdir ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/ca
  cp ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/peers/peertm2.manufacturer.com/msp/cacerts/* ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/ca/ca.manufacturer.com-cert.pem

  # --------------------------------------------------------------------------------
 
  mkdir -p ../crypto-config/peerOrganizations/manufacturer.com/users
  mkdir -p ../crypto-config/peerOrganizations/manufacturer.com/users/User1@manufacturer.com

  echo
  echo "## Generate the user msp"
  echo
   
  fabric-ca-client enroll -u https://user1:user1pw@localhost:2052 --caname ca.manufacturer.com -M ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/users/User1@manufacturer.com/msp --tls.certfiles ${PWD}/fabric-ca/org2/tls-cert.pem
   

  mkdir -p ../crypto-config/peerOrganizations/manufacturer.com/users/Admin@manufacturer.com

  echo
  echo "## Generate the org admin msp"
  echo
   
  fabric-ca-client enroll -u https://org2admin:org2adminpw@localhost:2052 --caname ca.manufacturer.com -M ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/users/Admin@manufacturer.com/msp --tls.certfiles ${PWD}/fabric-ca/org2/tls-cert.pem
   

  cp ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/msp/config.yaml ${PWD}/../crypto-config/peerOrganizations/manufacturer.com/users/Admin@manufacturer.com/msp/config.yaml

}

# createCertificateForOrg2

createCertificatesForOrg3() {
  echo
  echo "Enroll the CA admin"
  echo
  mkdir -p ../crypto-config/peerOrganizations/warehouse.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/../crypto-config/peerOrganizations/warehouse.com/

   
  fabric-ca-client enroll -u https://admin:adminpw@localhost:2053 --caname ca.warehouse.com --tls.certfiles ${PWD}/fabric-ca/org3/tls-cert.pem
   

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-2053-ca-warehouse-com.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-2053-ca-warehouse-com.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-2053-ca-warehouse-com.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-2053-ca-warehouse-com.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/../crypto-config/peerOrganizations/warehouse.com/msp/config.yaml

  echo
  echo "Register peerts1"
  echo
   
  fabric-ca-client register --caname ca.warehouse.com --id.name peerts1 --id.secret peerts1pw --id.type peer --tls.certfiles ${PWD}/fabric-ca/org3/tls-cert.pem

  echo
  echo "Register peerts2"
  echo
   
  fabric-ca-client register --caname ca.warehouse.com --id.name peerts2 --id.secret peerts2pw --id.type peer --tls.certfiles ${PWD}/fabric-ca/org3/tls-cert.pem
   

  echo
  echo "Register user"
  echo
   
  fabric-ca-client register --caname ca.warehouse.com --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/fabric-ca/org3/tls-cert.pem
   

  echo
  echo "Register the org admin"
  echo
   
  fabric-ca-client register --caname ca.warehouse.com --id.name org3admin --id.secret org3adminpw --id.type admin --tls.certfiles ${PWD}/fabric-ca/org3/tls-cert.pem
   

  mkdir -p ../crypto-config/peerOrganizations/warehouse.com/peers
  mkdir -p ../crypto-config/peerOrganizations/warehouse.com/peers/peerts1.warehouse.com

  # --------------------------------------------------------------
  # Peer ts1
  echo
  echo "## Generate the peerts1 msp"
  echo
   
  fabric-ca-client enroll -u https://peerts1:peerts1pw@localhost:2053 --caname ca.warehouse.com -M ${PWD}/../crypto-config/peerOrganizations/warehouse.com/peers/peerts1.warehouse.com/msp --csr.hosts peerts1.warehouse.com --tls.certfiles ${PWD}/fabric-ca/org3/tls-cert.pem
   

  cp ${PWD}/../crypto-config/peerOrganizations/warehouse.com/msp/config.yaml ${PWD}/../crypto-config/peerOrganizations/warehouse.com/peers/peerts1.warehouse.com/msp/config.yaml

  echo
  echo "## Generate the peerts1-tls certificates"
  echo
   
  fabric-ca-client enroll -u https://peerts1:peerts1pw@localhost:2053 --caname ca.warehouse.com -M ${PWD}/../crypto-config/peerOrganizations/warehouse.com/peers/peerts1.warehouse.com/tls --enrollment.profile tls --csr.hosts peerts1.warehouse.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/org3/tls-cert.pem
   

  cp ${PWD}/../crypto-config/peerOrganizations/warehouse.com/peers/peerts1.warehouse.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/warehouse.com/peers/peerts1.warehouse.com/tls/ca.crt
  cp ${PWD}/../crypto-config/peerOrganizations/warehouse.com/peers/peerts1.warehouse.com/tls/signcerts/* ${PWD}/../crypto-config/peerOrganizations/warehouse.com/peers/peerts1.warehouse.com/tls/server.crt
  cp ${PWD}/../crypto-config/peerOrganizations/warehouse.com/peers/peerts1.warehouse.com/tls/keystore/* ${PWD}/../crypto-config/peerOrganizations/warehouse.com/peers/peerts1.warehouse.com/tls/server.key

  mkdir ${PWD}/../crypto-config/peerOrganizations/warehouse.com/msp/tlscacerts
  cp ${PWD}/../crypto-config/peerOrganizations/warehouse.com/peers/peerts1.warehouse.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/warehouse.com/msp/tlscacerts/ca.crt

  mkdir ${PWD}/../crypto-config/peerOrganizations/warehouse.com/tlsca
  cp ${PWD}/../crypto-config/peerOrganizations/warehouse.com/peers/peerts1.warehouse.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/warehouse.com/tlsca/tlsca.warehouse.com-cert.pem

  mkdir ${PWD}/../crypto-config/peerOrganizations/warehouse.com/peers/peerts1.warehouse.com/msp/tlscacerts
  cp ${PWD}/../crypto-config/peerOrganizations/warehouse.com/peers/peerts1.warehouse.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/warehouse.com/peers/peerts1.warehouse.com/msp/tlscacerts/tlsca.warehouse.com-cert.pem

  mkdir ${PWD}/../crypto-config/peerOrganizations/warehouse.com/ca
  cp ${PWD}/../crypto-config/peerOrganizations/warehouse.com/peers/peerts1.warehouse.com/msp/cacerts/* ${PWD}/../crypto-config/peerOrganizations/warehouse.com/ca/ca.warehouse.com-cert.pem

  # --------------------------------------------------------------------------------
  # Peer ts2
  echo
  echo "## Generate the peerts2 msp"
  echo
   
  fabric-ca-client enroll -u https://peerts2:peerts2pw@localhost:2053 --caname ca.warehouse.com -M ${PWD}/../crypto-config/peerOrganizations/warehouse.com/peers/peerts2.warehouse.com/msp --csr.hosts peerts2.warehouse.com --tls.certfiles ${PWD}/fabric-ca/org3/tls-cert.pem
   

  cp ${PWD}/../crypto-config/peerOrganizations/warehouse.com/msp/config.yaml ${PWD}/../crypto-config/peerOrganizations/warehouse.com/peers/peerts2.warehouse.com/msp/config.yaml

  echo
  echo "## Generate the peerts2-tls certificates"
  echo
   
  fabric-ca-client enroll -u https://peerts2:peerts2pw@localhost:2053 --caname ca.warehouse.com -M ${PWD}/../crypto-config/peerOrganizations/warehouse.com/peers/peerts2.warehouse.com/tls --enrollment.profile tls --csr.hosts peerts2.warehouse.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/org3/tls-cert.pem
   

  cp ${PWD}/../crypto-config/peerOrganizations/warehouse.com/peers/peerts2.warehouse.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/warehouse.com/peers/peerts2.warehouse.com/tls/ca.crt
  cp ${PWD}/../crypto-config/peerOrganizations/warehouse.com/peers/peerts2.warehouse.com/tls/signcerts/* ${PWD}/../crypto-config/peerOrganizations/warehouse.com/peers/peerts2.warehouse.com/tls/server.crt
  cp ${PWD}/../crypto-config/peerOrganizations/warehouse.com/peers/peerts2.warehouse.com/tls/keystore/* ${PWD}/../crypto-config/peerOrganizations/warehouse.com/peers/peerts2.warehouse.com/tls/server.key

  # mkdir ${PWD}/../crypto-config/peerOrganizations/warehouse.com/msp/tlscacerts
  cp ${PWD}/../crypto-config/peerOrganizations/warehouse.com/peers/peerts2.warehouse.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/warehouse.com/msp/tlscacerts/ca.crt

  # mkdir ${PWD}/../crypto-config/peerOrganizations/warehouse.com/tlsca
  cp ${PWD}/../crypto-config/peerOrganizations/warehouse.com/peers/peerts2.warehouse.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/warehouse.com/tlsca/tlsca.warehouse.com-cert.pem

  mkdir ${PWD}/../crypto-config/peerOrganizations/warehouse.com/peers/peerts2.warehouse.com/msp/tlscacerts
  cp ${PWD}/../crypto-config/peerOrganizations/warehouse.com/peers/peerts2.warehouse.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/warehouse.com/peers/peerts2.warehouse.com/msp/tlscacerts/tlsca.warehouse.com-cert.pem

  # mkdir ${PWD}/../crypto-config/peerOrganizations/warehouse.com/ca
  cp ${PWD}/../crypto-config/peerOrganizations/warehouse.com/peers/peerts2.warehouse.com/msp/cacerts/* ${PWD}/../crypto-config/peerOrganizations/warehouse.com/ca/ca.warehouse.com-cert.pem
  # --------------------------------------------------------------------------------

  mkdir -p ../crypto-config/peerOrganizations/warehouse.com/users
  mkdir -p ../crypto-config/peerOrganizations/warehouse.com/users/User1@warehouse.com

  echo
  echo "## Generate the user msp"
  echo
   
  fabric-ca-client enroll -u https://user1:user1pw@localhost:2053 --caname ca.warehouse.com -M ${PWD}/../crypto-config/peerOrganizations/warehouse.com/users/User1@warehouse.com/msp --tls.certfiles ${PWD}/fabric-ca/org3/tls-cert.pem
   

  mkdir -p ../crypto-config/peerOrganizations/warehouse.com/users/Admin@warehouse.com

  echo
  echo "## Generate the org admin msp"
  echo
   
  fabric-ca-client enroll -u https://org3admin:org3adminpw@localhost:2053 --caname ca.warehouse.com -M ${PWD}/../crypto-config/peerOrganizations/warehouse.com/users/Admin@warehouse.com/msp --tls.certfiles ${PWD}/fabric-ca/org3/tls-cert.pem
   

  cp ${PWD}/../crypto-config/peerOrganizations/warehouse.com/msp/config.yaml ${PWD}/../crypto-config/peerOrganizations/warehouse.com/users/Admin@warehouse.com/msp/config.yaml

}

createCertificatesForOrg4() {
  echo
  echo "Enroll the CA admin"
  echo
  mkdir -p ../crypto-config/peerOrganizations/retailer.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/../crypto-config/peerOrganizations/retailer.com/

   
  fabric-ca-client enroll -u https://admin:adminpw@localhost:2054 --caname ca.retailer.com --tls.certfiles ${PWD}/fabric-ca/org4/tls-cert.pem
   

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-2054-ca-retailer-com.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-2054-ca-retailer-com.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-2054-ca-retailer-com.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-2054-ca-retailer-com.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/../crypto-config/peerOrganizations/retailer.com/msp/config.yaml

  echo
  echo "Register peerbb1"
  echo
   
  fabric-ca-client register --caname ca.retailer.com --id.name peerbb1 --id.secret peerbb1pw --id.type peer --tls.certfiles ${PWD}/fabric-ca/org4/tls-cert.pem

  echo
  echo "Register peerbb2"
  echo
   
  fabric-ca-client register --caname ca.retailer.com --id.name peerbb2 --id.secret peerbb2pw --id.type peer --tls.certfiles ${PWD}/fabric-ca/org4/tls-cert.pem
   

  echo
  echo "Register user"
  echo
   
  fabric-ca-client register --caname ca.retailer.com --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/fabric-ca/org4/tls-cert.pem
   

  echo
  echo "Register the org admin"
  echo
   
  fabric-ca-client register --caname ca.retailer.com --id.name org4admin --id.secret org4adminpw --id.type admin --tls.certfiles ${PWD}/fabric-ca/org4/tls-cert.pem
   

  mkdir -p ../crypto-config/peerOrganizations/retailer.com/peers
  mkdir -p ../crypto-config/peerOrganizations/retailer.com/peers/peerbb1.retailer.com

  # --------------------------------------------------------------
  # Peer ts1
  echo
  echo "## Generate the peerbb1 msp"
  echo
   
  fabric-ca-client enroll -u https://peerbb1:peerbb1pw@localhost:2054 --caname ca.retailer.com -M ${PWD}/../crypto-config/peerOrganizations/retailer.com/peers/peerbb1.retailer.com/msp --csr.hosts peerbb1.retailer.com --tls.certfiles ${PWD}/fabric-ca/org4/tls-cert.pem
   

  cp ${PWD}/../crypto-config/peerOrganizations/retailer.com/msp/config.yaml ${PWD}/../crypto-config/peerOrganizations/retailer.com/peers/peerbb1.retailer.com/msp/config.yaml

  echo
  echo "## Generate the peerbb1-tls certificates"
  echo
   
  fabric-ca-client enroll -u https://peerbb1:peerbb1pw@localhost:2054 --caname ca.retailer.com -M ${PWD}/../crypto-config/peerOrganizations/retailer.com/peers/peerbb1.retailer.com/tls --enrollment.profile tls --csr.hosts peerbb1.retailer.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/org4/tls-cert.pem
   

  cp ${PWD}/../crypto-config/peerOrganizations/retailer.com/peers/peerbb1.retailer.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/retailer.com/peers/peerbb1.retailer.com/tls/ca.crt
  cp ${PWD}/../crypto-config/peerOrganizations/retailer.com/peers/peerbb1.retailer.com/tls/signcerts/* ${PWD}/../crypto-config/peerOrganizations/retailer.com/peers/peerbb1.retailer.com/tls/server.crt
  cp ${PWD}/../crypto-config/peerOrganizations/retailer.com/peers/peerbb1.retailer.com/tls/keystore/* ${PWD}/../crypto-config/peerOrganizations/retailer.com/peers/peerbb1.retailer.com/tls/server.key

  mkdir ${PWD}/../crypto-config/peerOrganizations/retailer.com/msp/tlscacerts
  cp ${PWD}/../crypto-config/peerOrganizations/retailer.com/peers/peerbb1.retailer.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/retailer.com/msp/tlscacerts/ca.crt

  mkdir ${PWD}/../crypto-config/peerOrganizations/retailer.com/tlsca
  cp ${PWD}/../crypto-config/peerOrganizations/retailer.com/peers/peerbb1.retailer.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/retailer.com/tlsca/tlsca.retailer.com-cert.pem

  mkdir ${PWD}/../crypto-config/peerOrganizations/retailer.com/peers/peerbb1.retailer.com/msp/tlscacerts
  cp ${PWD}/../crypto-config/peerOrganizations/retailer.com/peers/peerbb1.retailer.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/retailer.com/peers/peerbb1.retailer.com/msp/tlscacerts/tlsca.retailer.com-cert.pem

  mkdir ${PWD}/../crypto-config/peerOrganizations/retailer.com/ca
  cp ${PWD}/../crypto-config/peerOrganizations/retailer.com/peers/peerbb1.retailer.com/msp/cacerts/* ${PWD}/../crypto-config/peerOrganizations/retailer.com/ca/ca.retailer.com-cert.pem

  # --------------------------------------------------------------------------------
  # Peer ts2
  echo
  echo "## Generate the peerbb2 msp"
  echo
   
  fabric-ca-client enroll -u https://peerbb2:peerbb2pw@localhost:2054 --caname ca.retailer.com -M ${PWD}/../crypto-config/peerOrganizations/retailer.com/peers/peerbb2.retailer.com/msp --csr.hosts peerbb2.retailer.com --tls.certfiles ${PWD}/fabric-ca/org4/tls-cert.pem
   

  cp ${PWD}/../crypto-config/peerOrganizations/retailer.com/msp/config.yaml ${PWD}/../crypto-config/peerOrganizations/retailer.com/peers/peerbb2.retailer.com/msp/config.yaml

  echo
  echo "## Generate the peerbb2-tls certificates"
  echo
   
  fabric-ca-client enroll -u https://peerbb2:peerbb2pw@localhost:2054 --caname ca.retailer.com -M ${PWD}/../crypto-config/peerOrganizations/retailer.com/peers/peerbb2.retailer.com/tls --enrollment.profile tls --csr.hosts peerbb2.retailer.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/org4/tls-cert.pem
   

  cp ${PWD}/../crypto-config/peerOrganizations/retailer.com/peers/peerbb2.retailer.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/retailer.com/peers/peerbb2.retailer.com/tls/ca.crt
  cp ${PWD}/../crypto-config/peerOrganizations/retailer.com/peers/peerbb2.retailer.com/tls/signcerts/* ${PWD}/../crypto-config/peerOrganizations/retailer.com/peers/peerbb2.retailer.com/tls/server.crt
  cp ${PWD}/../crypto-config/peerOrganizations/retailer.com/peers/peerbb2.retailer.com/tls/keystore/* ${PWD}/../crypto-config/peerOrganizations/retailer.com/peers/peerbb2.retailer.com/tls/server.key

  # mkdir ${PWD}/../crypto-config/peerOrganizations/retailer.com/msp/tlscacerts
  cp ${PWD}/../crypto-config/peerOrganizations/retailer.com/peers/peerbb2.retailer.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/retailer.com/msp/tlscacerts/ca.crt

  # mkdir ${PWD}/../crypto-config/peerOrganizations/retailer.com/tlsca
  cp ${PWD}/../crypto-config/peerOrganizations/retailer.com/peers/peerbb2.retailer.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/retailer.com/tlsca/tlsca.retailer.com-cert.pem

  mkdir ${PWD}/../crypto-config/peerOrganizations/retailer.com/peers/peerbb2.retailer.com/msp/tlscacerts
  cp ${PWD}/../crypto-config/peerOrganizations/retailer.com/peers/peerbb2.retailer.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/retailer.com/peers/peerbb2.retailer.com/msp/tlscacerts/tlsca.retailer.com-cert.pem

  # mkdir ${PWD}/../crypto-config/peerOrganizations/retailer.com/ca
  cp ${PWD}/../crypto-config/peerOrganizations/retailer.com/peers/peerbb2.retailer.com/msp/cacerts/* ${PWD}/../crypto-config/peerOrganizations/retailer.com/ca/ca.retailer.com-cert.pem
  # --------------------------------------------------------------------------------

  mkdir -p ../crypto-config/peerOrganizations/retailer.com/users
  mkdir -p ../crypto-config/peerOrganizations/retailer.com/users/User1@retailer.com

  echo
  echo "## Generate the user msp"
  echo
   
  fabric-ca-client enroll -u https://user1:user1pw@localhost:2054 --caname ca.retailer.com -M ${PWD}/../crypto-config/peerOrganizations/retailer.com/users/User1@retailer.com/msp --tls.certfiles ${PWD}/fabric-ca/org4/tls-cert.pem
   

  mkdir -p ../crypto-config/peerOrganizations/retailer.com/users/Admin@retailer.com

  echo
  echo "## Generate the org admin msp"
  echo
   
  fabric-ca-client enroll -u https://org4admin:org4adminpw@localhost:2054 --caname ca.retailer.com -M ${PWD}/../crypto-config/peerOrganizations/retailer.com/users/Admin@retailer.com/msp --tls.certfiles ${PWD}/fabric-ca/org4/tls-cert.pem
   

  cp ${PWD}/../crypto-config/peerOrganizations/retailer.com/msp/config.yaml ${PWD}/../crypto-config/peerOrganizations/retailer.com/users/Admin@retailer.com/msp/config.yaml

}

createCertificatesForOrg5() {
  echo
  echo "Enroll the CA admin"
  echo
  mkdir -p ../crypto-config/peerOrganizations/gov.io/

  export FABRIC_CA_CLIENT_HOME=${PWD}/../crypto-config/peerOrganizations/gov.io/

   
  fabric-ca-client enroll -u https://admin:adminpw@localhost:2055 --caname ca.gov.io --tls.certfiles ${PWD}/fabric-ca/org5/tls-cert.pem
   

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-2055-ca-gov-com.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-2055-ca-gov-com.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-2055-ca-gov-com.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-2055-ca-gov-com.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/../crypto-config/peerOrganizations/gov.io/msp/config.yaml

  echo
  echo "Register peergov1"
  echo
   
  fabric-ca-client register --caname ca.gov.io --id.name peergov1 --id.secret peergov1pw --id.type peer --tls.certfiles ${PWD}/fabric-ca/org5/tls-cert.pem

  echo
  echo "Register user"
  echo
   
  fabric-ca-client register --caname ca.gov.io --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/fabric-ca/org5/tls-cert.pem
   

  echo
  echo "Register the org admin"
  echo
   
  fabric-ca-client register --caname ca.gov.io --id.name org5admin --id.secret org5adminpw --id.type admin --tls.certfiles ${PWD}/fabric-ca/org5/tls-cert.pem
   

  mkdir -p ../crypto-config/peerOrganizations/gov.io/peers
  mkdir -p ../crypto-config/peerOrganizations/gov.io/peers/peergov1.gov.io

  # --------------------------------------------------------------
  # Peer gov1
  echo
  echo "## Generate the peergov1 msp"
  echo
   
  fabric-ca-client enroll -u https://peergov1:peergov1pw@localhost:2055 --caname ca.gov.io -M ${PWD}/../crypto-config/peerOrganizations/gov.io/peers/peergov1.gov.io/msp --csr.hosts peergov1.gov.io --tls.certfiles ${PWD}/fabric-ca/org5/tls-cert.pem
   

  cp ${PWD}/../crypto-config/peerOrganizations/gov.io/msp/config.yaml ${PWD}/../crypto-config/peerOrganizations/gov.io/peers/peergov1.gov.io/msp/config.yaml

  echo
  echo "## Generate the peergov1-tls certificates"
  echo
   
  fabric-ca-client enroll -u https://peergov1:peergov1pw@localhost:2055 --caname ca.gov.io -M ${PWD}/../crypto-config/peerOrganizations/gov.io/peers/peergov1.gov.io/tls --enrollment.profile tls --csr.hosts peergov1.gov.io --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/org5/tls-cert.pem
   

  cp ${PWD}/../crypto-config/peerOrganizations/gov.io/peers/peergov1.gov.io/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/gov.io/peers/peergov1.gov.io/tls/ca.crt
  cp ${PWD}/../crypto-config/peerOrganizations/gov.io/peers/peergov1.gov.io/tls/signcerts/* ${PWD}/../crypto-config/peerOrganizations/gov.io/peers/peergov1.gov.io/tls/server.crt
  cp ${PWD}/../crypto-config/peerOrganizations/gov.io/peers/peergov1.gov.io/tls/keystore/* ${PWD}/../crypto-config/peerOrganizations/gov.io/peers/peergov1.gov.io/tls/server.key

  mkdir ${PWD}/../crypto-config/peerOrganizations/gov.io/msp/tlscacerts
  cp ${PWD}/../crypto-config/peerOrganizations/gov.io/peers/peergov1.gov.io/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/gov.io/msp/tlscacerts/ca.crt

  mkdir ${PWD}/../crypto-config/peerOrganizations/gov.io/tlsca
  cp ${PWD}/../crypto-config/peerOrganizations/gov.io/peers/peergov1.gov.io/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/gov.io/tlsca/tlsca.gov.io-cert.pem

  mkdir ${PWD}/../crypto-config/peerOrganizations/gov.io/peers/peergov1.gov.io/msp/tlscacerts
  cp ${PWD}/../crypto-config/peerOrganizations/gov.io/peers/peergov1.gov.io/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/gov.com/peers/peergov1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem

  mkdir ${PWD}/../crypto-config/peerOrganizations/gov.io/ca
  cp ${PWD}/../crypto-config/peerOrganizations/gov.io/peers/peergov1.gov.io/msp/cacerts/* ${PWD}/../crypto-config/peerOrganizations/gov.io/ca/ca.gov.io-cert.pem

  # --------------------------------------------------------------------------------
  
  mkdir -p ../crypto-config/peerOrganizations/gov.io/users
  mkdir -p ../crypto-config/peerOrganizations/gov.io/users/User1@gov.io

  echo
  echo "## Generate the user msp"
  echo
   
  fabric-ca-client enroll -u https://user1:user1pw@localhost:2055 --caname ca.gov.io -M ${PWD}/../crypto-config/peerOrganizations/gov.io/users/User1@gov.io/msp --tls.certfiles ${PWD}/fabric-ca/org5/tls-cert.pem
   

  mkdir -p ../crypto-config/peerOrganizations/gov.io/users/Admin@gov.io

  echo
  echo "## Generate the org admin msp"
  echo
   
  fabric-ca-client enroll -u https://org5admin:org5adminpw@localhost:2055 --caname ca.gov.io -M ${PWD}/../crypto-config/peerOrganizations/gov.io/users/Admin@gov.io/msp --tls.certfiles ${PWD}/fabric-ca/org5/tls-cert.pem
   

  cp ${PWD}/../crypto-config/peerOrganizations/gov.io/msp/config.yaml ${PWD}/../crypto-config/peerOrganizations/gov.io/users/Admin@gov.io/msp/config.yaml

}

createCertificatesForOrderer() {
  echo
  echo "Enroll the CA admin"
  echo
  mkdir -p ../crypto-config/ordererOrganizations/gov.io

  export FABRIC_CA_CLIENT_HOME=${PWD}/../crypto-config/ordererOrganizations/gov.io

   
  fabric-ca-client enroll -u https://admin:adminpw@localhost:2050 --caname ca-orderer --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-2050-ca-orderer.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-2050-ca-orderer.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-2050-ca-orderer.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-2050-ca-orderer.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/../crypto-config/ordererOrganizations/gov.io/msp/config.yaml

  echo
  echo "Register orderer"
  echo
   
  fabric-ca-client register --caname ca-orderer --id.name orderer1 --id.secret orderer1pw --id.type orderer --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

#   echo
#   echo "Register orderer2"
#   echo
   
#   fabric-ca-client register --caname ca-orderer --id.name orderer2 --id.secret ordererpw --id.type orderer --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

#   echo
#   echo "Register orderer3"
#   echo
   
#   fabric-ca-client register --caname ca-orderer --id.name orderer3 --id.secret ordererpw --id.type orderer --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

  echo
  echo "Register the orderer admin"
  echo
   
  fabric-ca-client register --caname ca-orderer --id.name ordererAdmin --id.secret ordererAdminpw --id.type admin --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

  mkdir -p ../crypto-config/ordererOrganizations/gov.io/orderers
  # mkdir -p ../crypto-config/ordererOrganizations/gov.io/orderers/gov.io

  # ---------------------------------------------------------------------------
  #  Orderer

  mkdir -p ../crypto-config/ordererOrganizations/gov.io/orderers/orderer1.gov.io

  echo
  echo "## Generate the orderer msp"
  echo
   
  fabric-ca-client enroll -u https://orderer1:orderer1pw@localhost:2050 --caname ca-orderer -M ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp --csr.hosts orderer1.gov.io --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

  cp ${PWD}/../crypto-config/ordererOrganizations/gov.io/msp/config.yaml ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/config.yaml

  echo
  echo "## Generate the orderer-tls certificates"
  echo
   
  fabric-ca-client enroll -u https://orderer1:orderer1pw@localhost:2050 --caname ca-orderer -M ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer1.gov.io/tls --enrollment.profile tls --csr.hosts orderer1.gov.io --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

  cp ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer1.gov.io/tls/tlscacerts/* ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer1.gov.io/tls/ca.crt
  cp ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer1.gov.io/tls/signcerts/* ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer1.gov.io/tls/server.crt
  cp ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer1.gov.io/tls/keystore/* ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer1.gov.io/tls/server.key

  mkdir ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts
  cp ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer1.gov.io/tls/tlscacerts/* ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem

  mkdir ${PWD}/../crypto-config/ordererOrganizations/gov.io/msp/tlscacerts
  cp ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer1.gov.io/tls/tlscacerts/* ${PWD}/../crypto-config/ordererOrganizations/gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem

  # -----------------------------------------------------------------------
  #  Orderer 2

#   mkdir -p ../crypto-config/ordererOrganizations/gov.io/orderers/orderer2.gov.io

#   echo
#   echo "## Generate the orderer msp"
#   echo
   
#   fabric-ca-client enroll -u https://orderer2:ordererpw@localhost:2050 --caname ca-orderer -M ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer2.gov.io/msp --csr.hosts orderer2.gov.io --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

#   cp ${PWD}/../crypto-config/ordererOrganizations/gov.io/msp/config.yaml ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer2.gov.io/msp/config.yaml

#   echo
#   echo "## Generate the orderer-tls certificates"
#   echo
   
#   fabric-ca-client enroll -u https://orderer2:ordererpw@localhost:2050 --caname ca-orderer -M ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer2.gov.io/tls --enrollment.profile tls --csr.hosts orderer2.gov.io --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

#   cp ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer2.gov.io/tls/tlscacerts/* ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer2.gov.io/tls/ca.crt
#   cp ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer2.gov.io/tls/signcerts/* ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer2.gov.io/tls/server.crt
#   cp ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer2.gov.io/tls/keystore/* ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer2.gov.io/tls/server.key

#   mkdir ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer2.gov.io/msp/tlscacerts
#   cp ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer2.gov.io/tls/tlscacerts/* ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer2.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem

  # mkdir ${PWD}/../crypto-config/ordererOrganizations/gov.io/msp/tlscacerts
  # cp ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer2.gov.io/tls/tlscacerts/* ${PWD}/../crypto-config/ordererOrganizations/gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem

  # ---------------------------------------------------------------------------
  #  Orderer 3
#   mkdir -p ../crypto-config/ordererOrganizations/gov.io/orderers/orderer3.gov.io

#   echo
#   echo "## Generate the orderer msp"
#   echo
   
#   fabric-ca-client enroll -u https://orderer3:ordererpw@localhost:2050 --caname ca-orderer -M ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer3.gov.io/msp --csr.hosts orderer3.gov.io --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

#   cp ${PWD}/../crypto-config/ordererOrganizations/gov.io/msp/config.yaml ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer3.gov.io/msp/config.yaml

#   echo
#   echo "## Generate the orderer-tls certificates"
#   echo
   
#   fabric-ca-client enroll -u https://orderer3:ordererpw@localhost:2050 --caname ca-orderer -M ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer3.gov.io/tls --enrollment.profile tls --csr.hosts orderer3.gov.io --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

#   cp ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer3.gov.io/tls/tlscacerts/* ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer3.gov.io/tls/ca.crt
#   cp ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer3.gov.io/tls/signcerts/* ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer3.gov.io/tls/server.crt
#   cp ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer3.gov.io/tls/keystore/* ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer3.gov.io/tls/server.key

#   mkdir ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer3.gov.io/msp/tlscacerts
#   cp ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer3.gov.io/tls/tlscacerts/* ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer3.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem

  # mkdir ${PWD}/../crypto-config/ordererOrganizations/gov.io/msp/tlscacerts
  # cp ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer3.gov.io/tls/tlscacerts/* ${PWD}/../crypto-config/ordererOrganizations/gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem

  # ---------------------------------------------------------------------------

  mkdir -p ../crypto-config/ordererOrganizations/gov.io/users
  mkdir -p ../crypto-config/ordererOrganizations/gov.io/users/Admin@gov.io

  echo
  echo "## Generate the admin msp"
  echo
   
  fabric-ca-client enroll -u https://ordererAdmin:ordererAdminpw@localhost:2050 --caname ca-orderer -M ${PWD}/../crypto-config/ordererOrganizations/gov.io/users/Admin@gov.io/msp --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

  cp ${PWD}/../crypto-config/ordererOrganizations/gov.io/msp/config.yaml ${PWD}/../crypto-config/ordererOrganizations/gov.io/users/Admin@gov.io/msp/config.yaml

}

# createCretificateForOrderer
# sudo rm -r ./fabric-ca
sudo docker-compose -f docker-compose.yaml up -d
sleep 6
sudo rm -r ../crypto-config
createcertificatesForOrg1
createCertificatesForOrg2
createCertificatesForOrg3
createCertificatesForOrg4
createCertificatesForOrg5
createCertificatesForOrderer