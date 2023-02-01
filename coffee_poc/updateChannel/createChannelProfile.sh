#!/bin/sh

if [ $1 = createTx ];
then
    echo 'Enter channel name'
    read NAME
    echo 'Enter number of orgs for channel'
    read NUM

    mkdir -p ${PWD}/profileBuild
    export FABRIC_CFG_PATH=$PWD/profileBuild

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
                        MSPDir: '${PWD}'/../crypto-config/peerOrganizations/'${LEVEL}'.com/msp
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

    echo 'Printing Channel transaction artifact for '$NAME''
    configtxgen -profile newProfile -outputCreateChannelTx ../channel-artifacts/$NAME.tx -channelID $NAME

elif [ $1 = createAnchorTxAndUpdate ];
then
    export FABRIC_CFG_PATH=$PWD/profileBuild
    echo 'Enter channel name'
    read CHANNEL_NAME
    echo 'Enter organisation name'
    read ORG_NAME

    if [ $ORG_NAME = teafarm ];
    then    
        ORG_LEVEL='production'
    elif [ $ORG_NAME = tata ];
    then    
        ORG_LEVEL='manufacturer'
    elif [ $ORG_NAME = tatastore];
    then    
        ORG_LEVEL='warehouse'
    else 
        ORG_LEVEL='retail'
    fi

    sudo docker exec -it cli-$ORG_LEVEL-1 peer channel list > channel_list.txt 2>&1
    CHANNEL=$(cat channel_list.txt | grep $CHANNEL_NAME)
    echo $CHANNEL
    if [ $CHANNEL -ne $CHANNEL_NAME ];
    then
        echo 'Channel does not exist'
        exit
    else 
        echo 'Printing anchor peer tx'
        configtxgen -profile newProfile -outputAnchorPeersUpdate ../channel-artifacts/${CHANNEL_NAME}_${ORG_NAME}_anchor.tx -channelID $CHANNEL_NAME -asOrg $ORG_NAME
        
        echo 'Updating anchor peer to '$CHANNEL_NAME''
        sudo docker exec -it cli-$ORG_LEVEL-1 peer channel update -o orderer1.gov.io:7050 --channelID $CHANNEL_NAME -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/${CHANNEL_NAME}_${ORG_NAME}_anchor.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem
    fi


elif [ $1 = createGenesisAndJoin ];
then    
    echo 'Enter channel name'
    read CHANNEL_NAME
    echo 'Enter organisation name'
    read ORG_NAME

    if [ $ORG_NAME = teafarm ];
    then    
        ORG_LEVEL='production'
    elif [ $ORG_NAME = tata ];
    then    
        ORG_LEVEL='manufacturer'
    elif [ $ORG_NAME = tatastore];
    then    
        ORG_LEVEL='warehouse'
    else 
        ORG_LEVEL='retail'
    fi

    echo "Creating Genesis block for $CHANNEL_NAME"
    sudo docker exec -it cli-$ORG_LEVEL-1 peer channel create -o orderer1.gov.io:7050 -c $CHANNEL_NAME -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/$CHANNEL_NAME.tx --outputBlock /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/$CHANNEL_NAME.block --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/gov.io/orderers/orderer1.gov.io/msp/tlscacerts/tlsca.gov.io-cert.pem
    echo "Joining $ORG_NAME to $CHANNEL_NAME"
    sudo docker exec -it cli-$ORG_LEVEL-1 peer channel join -b ./channel-artifacts/$CHANNEL_NAME.block
else    
    echo '
    Commands reference:
    createTx -> to create the channel transaction artifact
    createGenesisAndJoin -> to create the genesis block for the required channel and join
    createAnchorTxAndUpdate -> to create the anchor peer transaction and update to channel
    '
fi
