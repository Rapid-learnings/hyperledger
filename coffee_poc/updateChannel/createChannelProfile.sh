#!/bin/sh

echo 'Enter number of orgs for channel'
read NUM

mkdir ${PWD}/profileBuild

echo '
Capabilities:
    Channel: &ChannelCapabilities
        V2_0: true

    Orderer: &OrdererCapabilities
        V2_0: true

    Application: &ApplicationCapabilities
        V2_0: true

Channel: &ChannelDefaults
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
        <<: *ChannelCapabilities

Application: &ApplicationDefaults
    ACLs: &ACLsDefault
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

    Policies: &ApplicationDefaultPolicies
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
        <<: *ApplicationCapabilities
' >${PWD}/profileBuild/default-config.yaml


i=1
until [ $i -gt $NUM ]
do
    echo 'Enter name of org '$i''
    read ORG
    echo 'Enter anchor peer ID'
    read ID
    echo 'Enter anchor peer port'
    read PORT
    echo '
Organizations: &OrganizationsList
    -   Name: governance
        ID: '${ORG}'MSP
        MSPDir: ../crypto-config/peerOrganizations/gov.io/msp
        Policies:
            Readers:
                Type: Signature
                Rule: "OR('${ORG}MSP.member', '${ORG}MSP.peer', '${ORG}MSP.admin', '${ORG}MSP.client')"
            Writers:
                Type: Signature
                Rule: "OR('${ORG}MSP.member', '${ORG}MSP.peer', '${ORG}MSP.admin', '${ORG}MSP.client')"
            Admins:
                Type: Signature
                Rule: "OR('${ORG}MSP.admin')"
            Endorsement:
                Type: Signature
                Rule: "OR('${ORG}MSP.peer', '${ORG}MSP.admin')"
        AnchorPeers:
            Host: '$ID'
            Port: '$PORT'
' >${PWD}/profileBuild/$i.yaml

    i=$((i+1))
done 

j=1
while [ $j -lt $NUM ]
do
    k=$((j+1))
    yq merge -a -i -v ${PWD}/profileBuild/$k.yaml ${PWD}/profileBuild/$j.yaml 
    j=$((j+1))
done

yq m -ai ${PWD}/profileBuild/j.yaml ${PWD}/profileBuild/default-config.yaml

yq 

    # Profiles:
    #     CoffeeChannelProfile:
    #         Consortium: SampleConsortium
    #         <<: *ChannelDefaults
    #         Application:
    #             <<: *ApplicationDefaults
    #             <<: *OrganizationsList
    #             Capabilities:
    #                 <<: *ApplicationCapabilities