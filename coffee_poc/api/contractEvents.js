'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

async function contractEvents() {
    const walletPath = path.join(process.cwd(), './teafarm-wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const gateway = new Gateway();
    try{
        const listener = async (event) => {
            if (event.eventName === 'placeOrder') {
                // Run business process to handle orders
                const details = event.payload.toString('utf8');
                event = JSON.parse(details);
                console.log('************************ Start placeOrder Event **********************************');
                console.log(`order number: ${JSON.parse(issueResponse.toString())}`);
                console.log(`amount: ${event.amount}`);
                console.log(`quantity: ${event.quantity}`);
                console.log(`status: ${event.Status}`);
                console.log(`country: ${event.country}`);
                console.log(`state: ${event.state}`);
                console.log('************************ End placeOrder Event ************************************');
            }
        };
        let userName = 'user1'
        const ccpPath = path.join(process.cwd(), './connection-profiles/mfc-prd-config.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'))
        const cco = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled: true, asLocalhost: true }
        };
        console.log('Connecting to gateway');
        await gateway.connect(ccp, cco);
        console.log('Connecting to channel');
        const network = await gateway.getNetwork('mfd-prd-channel');
        console.log('Connecting to contract');
        const contract = await network.getContract('pmcc');

        console.log('Submitting transaction to place order');
        const issueResponse = await contract.submitTransaction('placeOrder', '100', 'india', 'delhi');
        console.log('response: ', issueResponse.toString());
        await contract.submitTransaction('updateStatusToInTransit', issueResponse.toString());

        // await contract.addContractListener(listener);
        
        console.log('Submitting transaction to get order details');
        const response = await contract.submitTransaction('getOrderDetails', issueResponse.toString());
        console.log('order details: ', JSON.parse(response.toString()))

    } catch(err) {
        throw err;
    } finally {
        console.log("disconnecting gateway");
        gateway.disconnect();
    }
}

contractEvents()