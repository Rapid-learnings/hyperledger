createCretificatesForOrderer() {
  echo
  echo "Enroll the CA admin"
  echo
  mkdir -p ../crypto-config/ordererOrganizations/gov.io

  export FABRIC_CA_CLIENT_HOME=${PWD}/../crypto-config/ordererOrganizations/gov.io

   
  fabric-ca-client enroll -u https://admin:adminpw@localhost:12054 --caname ca-orderer --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-12054-ca-orderer.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-12054-ca-orderer.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-12054-ca-orderer.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-12054-ca-orderer.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/../crypto-config/ordererOrganizations/gov.io/msp/config.yaml

  echo
  echo "Register orderer"
  echo
   
  fabric-ca-client register --caname ca-orderer --id.name orderer --id.secret ordererpw --id.type orderer --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

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

  mkdir -p ../crypto-config/ordererOrganizations/gov.io/orderers/orderer.gov.io

  echo
  echo "## Generate the orderer msp"
  echo
   
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:12054 --caname ca-orderer -M ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer.gov.io/msp --csr.hosts orderer.gov.io --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

  cp ${PWD}/../crypto-config/ordererOrganizations/gov.io/msp/config.yaml ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer.gov.io/msp/config.yaml

  echo
  echo "## Generate the orderer-tls certificates"
  echo
   
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:12054 --caname ca-orderer -M ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer.gov.io/tls --enrollment.profile tls --csr.hosts orderer.gov.io --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

  cp ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer.gov.io/tls/tlscacerts/* ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer.gov.io/tls/ca.crt
  cp ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer.gov.io/tls/signcerts/* ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer.gov.io/tls/server.crt
  cp ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer.gov.io/tls/keystore/* ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer.gov.io/tls/server.key

  mkdir ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer.gov.io/msp/tlscacerts
  cp ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer.gov.io/tls/tlscacerts/* ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem

  mkdir ${PWD}/../crypto-config/ordererOrganizations/gov.io/msp/tlscacerts
  cp ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer.gov.io/tls/tlscacerts/* ${PWD}/../crypto-config/ordererOrganizations/gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem

  # -----------------------------------------------------------------------
  #  Orderer 2

#   mkdir -p ../crypto-config/ordererOrganizations/gov.io/orderers/orderer2.gov.io

#   echo
#   echo "## Generate the orderer msp"
#   echo
   
#   fabric-ca-client enroll -u https://orderer2:ordererpw@localhost:12054 --caname ca-orderer -M ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer2.gov.io/msp --csr.hosts orderer2.gov.io --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

#   cp ${PWD}/../crypto-config/ordererOrganizations/gov.io/msp/config.yaml ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer2.gov.io/msp/config.yaml

#   echo
#   echo "## Generate the orderer-tls certificates"
#   echo
   
#   fabric-ca-client enroll -u https://orderer2:ordererpw@localhost:12054 --caname ca-orderer -M ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer2.gov.io/tls --enrollment.profile tls --csr.hosts orderer2.gov.io --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

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
   
#   fabric-ca-client enroll -u https://orderer3:ordererpw@localhost:12054 --caname ca-orderer -M ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer3.gov.io/msp --csr.hosts orderer3.gov.io --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

#   cp ${PWD}/../crypto-config/ordererOrganizations/gov.io/msp/config.yaml ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer3.gov.io/msp/config.yaml

#   echo
#   echo "## Generate the orderer-tls certificates"
#   echo
   
#   fabric-ca-client enroll -u https://orderer3:ordererpw@localhost:12054 --caname ca-orderer -M ${PWD}/../crypto-config/ordererOrganizations/gov.io/orderers/orderer3.gov.io/tls --enrollment.profile tls --csr.hosts orderer3.gov.io --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

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
   
  fabric-ca-client enroll -u https://ordererAdmin:ordererAdminpw@localhost:12054 --caname ca-orderer -M ${PWD}/../crypto-config/ordererOrganizations/gov.io/users/Admin@gov.io/msp --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

  cp ${PWD}/../crypto-config/ordererOrganizations/gov.io/msp/config.yaml ${PWD}/../crypto-config/ordererOrganizations/gov.io/users/Admin@gov.io/msp/config.yaml

}