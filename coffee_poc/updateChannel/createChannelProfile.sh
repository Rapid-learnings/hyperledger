#!/bin/sh
export FABRIC_CFG_PATH=$PWD/profileBuild

echo 'Enter channel name'
read NAME
echo 'Enter number of orgs for channel'
read NUM

mkdir -p ${PWD}/profileBuild

echo '
Profiles:
    newProfile:
        Consortium: SampleConsortium

        Policies:
            Readers:
                Type: ImplicitMeta
                Rule: "ANY Readers"
            Writers:
                Type: ImplicitMeta
                Rule: "ANY Writers"
            Admins:
                Type: ImplicitMeta
                Rule: "MAJORITY Admins"

        Capabilities:
            V2_0: true
        Application: 
            ACLs:
                
                _lifecycle/CheckCommitReadiness: /Channel/Application/Writers

                _lifecycle/CommitChaincodeDefinition: /Channel/Application/Writers

                _lifecycle/QueryChaincodeDefinition: /Channel/Application/Writers

                _lifecycle/QueryChaincodeDefinitions: /Channel/Application/Writers

                lscc/ChaincodeExists: /Channel/Application/Readers

                lscc/GetDeploymentSpec: /Channel/Application/Readers

                lscc/GetChaincodeData: /Channel/Application/Readers

                lscc/GetInstantiatedChaincodes: /Channel/Application/Readers

                qscc/GetChainInfo: /Channel/Application/Readers

                qscc/GetBlockByNumber: /Channel/Application/Readers

                qscc/GetBlockByHash: /Channel/Application/Readers

                qscc/GetTransactionByID: /Channel/Application/Readers

                qscc/GetBlockByTxID: /Channel/Application/Readers

                cscc/GetConfigBlock: /Channel/Application/Readers

                cscc/GetChannelConfig: /Channel/Application/Readers

                peer/Propose: /Channel/Application/Writers

                peer/ChaincodeToChaincode: /Channel/Application/Writers

                event/Block: /Channel/Application/Readers

                event/FilteredBlock: /Channel/Application/Readers

            Organizations:

            Policies: 
                LifecycleEndorsement:
                    Type: ImplicitMeta
                    Rule: "MAJORITY Endorsement"
                Endorsement:
                    Type: ImplicitMeta
                    Rule: "MAJORITY Endorsement"
                Readers:
                    Type: ImplicitMeta
                    Rule: "ANY Readers"
                Writers:
                    Type: ImplicitMeta
                    Rule: "ANY Writers"
                Admins:
                    Type: ImplicitMeta
                    Rule: "MAJORITY Admins"

            Capabilities:
                V2_0: true

' >${PWD}/profileBuild/configtx.yaml


i=1
until [ $i -gt $NUM ]
do
    echo 'Enter name of org '$i''
    read ORG
    echo 'Enter anchor peer ID'
    read ID
    echo 'Enter anchor peer port'
    read PORT
    echo 'Enter org level'
    read LEVEL
    echo '
Profiles:
    newProfile:
        Application:
            Organizations: 
                -   Name: '${ORG}'
                    ID: '${ORG}'MSP
                    MSPDir: /home/ubuntu/hyperledger/coffee_poc/crypto-config/peerOrganizations/'${LEVEL}'.com/msp
                    Policies:
                        Readers:
                            Type: Signature
                            Rule: "OR('"'${ORG}MSP.member'"', '"'${ORG}MSP.peer'"', '"'${ORG}MSP.admin'"', '"'${ORG}MSP.client'"')"
                        Writers:
                            Type: Signature
                            Rule: "OR('"'${ORG}MSP.member'"', '"'${ORG}MSP.peer'"', '"'${ORG}MSP.admin'"', '"'${ORG}MSP.client'"')"
                        Admins:
                            Type: Signature
                            Rule: "OR('"'${ORG}MSP.admin'"')"
                        Endorsement:
                            Type: Signature
                            Rule: "OR('"'${ORG}MSP.peer'"', '"'${ORG}MSP.admin'"')"
                    AnchorPeers:
                        Host: '$ID'
                        Port: '$PORT'
' >${PWD}/profileBuild/$i.yaml

    i=$((i+1))
done 

j=1
while [ $j -lt $NUM ]
do
    yq merge -i -a=append ${PWD}/profileBuild/$((j+1)).yaml ${PWD}/profileBuild/$j.yaml 
    j=$((j+1))
done

yq m -i ${PWD}/profileBuild/configtx.yaml ${PWD}/profileBuild/$j.yaml

echo 'Printing Genesis block for '$NAME''
configtxgen -profile newProfile -outputCreateChannelTx ../channel-artifacts/$NAME.tx -channelID $NAME


# customGeneratedProfile:
#     Consortium: SampleConsortium
#     Channel: 
#         Policies:
#             Readers:
#                 Type: ImplicitMeta
#                 Rule: "ANY Readers"
#             Writers:
#                 Type: ImplicitMeta
#                 Rule: "ANY Writers"
#             Admins:
#                 Type: ImplicitMeta
#                 Rule: "MAJORITY Admins"

#         Capabilities:
#             Channel: 
#                 V2_0: true
#     Application: 
#         ACLs:

#             _lifecycle/CheckCommitReadiness: /Channel/Application/Writers

#             _lifecycle/CommitChaincodeDefinition: /Channel/Application/Writers

#             _lifecycle/QueryChaincodeDefinition: /Channel/Application/Writers

#             _lifecycle/QueryChaincodeDefinitions: /Channel/Application/Writers

#             lscc/ChaincodeExists: /Channel/Application/Readers

#             lscc/GetDeploymentSpec: /Channel/Application/Readers

#             lscc/GetChaincodeData: /Channel/Application/Readers

#             lscc/GetInstantiatedChaincodes: /Channel/Application/Readers

#             qscc/GetChainInfo: /Channel/Application/Readers

#             qscc/GetBlockByNumber: /Channel/Application/Readers

#             qscc/GetBlockByHash: /Channel/Application/Readers

#             qscc/GetTransactionByID: /Channel/Application/Readers

#             qscc/GetBlockByTxID: /Channel/Application/Readers

#             cscc/GetConfigBlock: /Channel/Application/Readers

#             cscc/GetChannelConfig: /Channel/Application/Readers

#             peer/Propose: /Channel/Application/Writers

#             peer/ChaincodeToChaincode: /Channel/Application/Writers

#             event/Block: /Channel/Application/Readers

#             event/FilteredBlock: /Channel/Application/Readers

#         Organizations:
#             -

#         Policies: 
#             LifecycleEndorsement:
#                 Type: ImplicitMeta
#                 Rule: "MAJORITY Endorsement"
#             Endorsement:
#                 Type: ImplicitMeta
#                 Rule: "MAJORITY Endorsement"
#             Readers:
#                 Type: ImplicitMeta
#                 Rule: "ANY Readers"
#             Writers:
#                 Type: ImplicitMeta
#                 Rule: "ANY Writers"
#             Admins:
#                 Type: ImplicitMeta
#                 Rule: "MAJORITY Admins"

#         Capabilities:
#                     Application:
#                         V2_0: true

# //
# //
# //
# //

# CoffeeChannelProfile:
#         Consortium: SampleConsortium
#         <<: *ChannelDefaults
#         Application:
#             <<: *ApplicationDefaults
#             Organizations:
#                 - *teafarm
#                 - *tata
#                 - *tatastore
#                 - *bigbazar
#             Capabilities:
#                 <<: *ApplicationCapabilities