'use strict';

const { Gateway, Wallets, DefaultEventHandlerStrategies } = require('fabric-network');
const path = require('path');
const fs = require('fs');

async function contractEvents() {
    const walletPath = path.join(process.cwd(), './tata-wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const gateway = new Gateway();
    try{
        let userName = 'admin'
        const ccp = JSON.parse(fs.readFileSync('./connection-profiles/mfc-cc.json'))
        const cco = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled:true, asLocalhost: true }
        };
        await gateway.connect(ccp, cco);
        const network = await gateway.getNetwork('mfd-prd-channel');
        const contract = await network.getContract('mfcprd');
        const issueResponse = await contract.submitTransaction('placeOrder', '100', 'kerala', 'India');
        const listener = await contract.addContractListener('my-contract-listener', 'placeOrder', (err, event, blockNumber, transactionId, status) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(`Block Number: ${blockNumber} Transaction ID: ${transactionId} Status: ${status}`);
        })
        event = event.payload.toString();
        event = JSON.parse(event)
    }
}