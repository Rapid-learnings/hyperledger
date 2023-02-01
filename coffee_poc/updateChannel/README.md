The createChannelProfile script allows the automatic creation of a channel profile with predefined policies. There are three commands to use for the script when used in order will successfully create the new channel for the organisation:

1) createChannelProfile createTx
2) createChannelProfile createGenesisAndJoin
3) createChannelProfile createAnchorTxAndUpdate

createTx command:
The tool takes in several user inputs in order to configure the profile i.e, 

    number of organisations the channel is for
    name of organisations
    anchor peer addresses
    organisation level in the network

Once all these details are provided it creates a new Profile in yaml, names the file configtx.yaml inside the profileBuild folder and sets the FABRIC_CFG_PATH to the said folder.

It then uses the configtxgen binary to create the channel transaction artifact.

createGenesisAndJoin command:
This command only takes two inputs:
    Name of channel
    Name of organisation

Once these details are provided it used the previously created artifact to create the genesis block and then joins the organisation to the channel using peer channel join command.

createAnchorTxAndUpdate command:
This command also takes only two inputs:
    Name of channel
    Name of organisation

Then it creates the anchor peer transaction artifact and uses the same artifact to submit the peer channel update command in order to update anchor peer to the newly created channel.

Once all these three commands are successful the new channel will be visible from the exporer.