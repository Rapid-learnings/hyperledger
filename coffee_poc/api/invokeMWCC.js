'use strict';

const { Gateway, Wallets } = require('fabric-network');
const registerUser = require("./registerUser");

const invokeObjMW = {}

const getWallet = async (org_name) => {
    const walletPath = await registerUser.getWalletPath(org_name);
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    return wallet;
    // console.log(`Wallet path: ${walletPath}`);
};
  
const getConnectionObject = (wallet, username) => {
    const connObj = {
      wallet,
      identity: username,
      discovery: { enabled: true, asLocalhost: true },
      // eventHandlerOptions: EventStrategies.NONE
    };
    return connObj;
};

invokeObjMW.evaluateTx = async (
    channelName,
    chaincodeName,
    fcn,
    username,
    org_name
    ) => {
    const wallet = await getWallet(org_name);
    const gateway = new Gateway();
    try {
        const ccp = await registerUser.getCCP(org_name);
    
        let identity = await wallet.get(username);
        if (!identity) {
            console.log(
            `An identity for the user ${username} does not exist in the wallet, so register user before retry`
            );
            return;
        }
    
        const connectOptions = getConnectionObject(wallet, username);
    
        console.log("Connection Object = ", connectOptions);

        console.log("connecting to gateway")
        
        await gateway.connect(ccp, connectOptions);
        
        console.log("connecting to network")
        
        const network = await gateway.getNetwork(channelName);
        
        console.log("connecting to contract")
        
        const contract = await network.getContract(chaincodeName);

        let result;
        // let message;
    
        switch (fcn) {
            case "returnRawStockAccordingToPMCC":
            result = await contract.evaluateTransaction(fcn);
            result = result.toString();
            break;
            case "availableDriedStock":
            result = await contract.evaluateTransaction(fcn);
            result = result.toString();
            break;
            case "availableRoastedStock":
            result = await contract.evaluateTransaction(fcn);
            result = result.toString();
            break;
            case "availableFinishedStock":
            result = await contract.evaluateTransaction(fcn);
            result = result.toString();
            break;
            case "getTotalPackages":
            result = await contract.evaluateTransaction(fcn);
            result = result.toString();
            break;
            case "getWastedStock":
            result = await contract.evaluateTransaction(fcn);
            result = result.toString();
            break;
            case "getWarehouseStock":
            result = await contract.evaluateTransaction(fcn);
            result = result.toString();
            break;
            case 'initialize':
            await contract.submitTransaction(fcn);
            break;
            default:
            break;
        }
        return result;
        
    } catch (error) {
        console.log(`Getting error: ${error}`);
        return error.message;
    } finally {
        console.log("disconnecting gateway");
        gateway.disconnect();
    }
};

invokeObjMW.dry = async(
    channelName,
    chaincodeName,
    args,
    username,
    org_name
    ) => {
    const wallet = await getWallet(org_name);
    const gateway = new Gateway();
    try {
        const ccp = await registerUser.getCCP(org_name);
    
        let identity = await wallet.get(username);
        if (!identity) {
            console.log(
            `An identity for the user ${username} does not exist in the wallet, so register user before retry`
            );
            return;
        }
    
        const connectOptions = getConnectionObject(wallet, username);
    
        console.log("Connection Object = ", connectOptions);
    
        await gateway.connect(ccp, connectOptions);
    
        const network = await gateway.getNetwork(channelName);

        const contract = await network.getContract(chaincodeName);

        await contract.submitTransaction('dry', args[0], args[1])
    } catch(err) {
        return err;
    } finally {
        console.log("disconnecting gateway");
        gateway.disconnect();
    }
}

invokeObjMW.roast = async(
    channelName,
    chaincodeName,
    args,
    username,
    org_name
    ) => {
    const wallet = await getWallet(org_name);
    const gateway = new Gateway();
    try {
        const ccp = await registerUser.getCCP(org_name);
    
        let identity = await wallet.get(username);
        if (!identity) {
            console.log(
            `An identity for the user ${username} does not exist in the wallet, so register user before retry`
            );
            return;
        }
    
        const connectOptions = getConnectionObject(wallet, username);
    
        console.log("Connection Object = ", connectOptions);

        await gateway.connect(ccp, connectOptions);
    
        const network = await gateway.getNetwork(channelName);

        const contract = await network.getContract(chaincodeName);

        await contract.submitTransaction('roast', args[0], args[1])
    } catch(err) {
        return err;
    } finally {
        console.log("disconnecting gateway");
        gateway.disconnect();
    }
}

invokeObjMW.doQA = async(
    channelName,
    chaincodeName,
    args,
    username,
    org_name
    ) => {
    const wallet = await getWallet(org_name);
    const gateway = new Gateway();
    try {
        const ccp = await registerUser.getCCP(org_name);
    
        let identity = await wallet.get(username);
        if (!identity) {
            console.log(
            `An identity for the user ${username} does not exist in the wallet, so register user before retry`
            );
            return;
        }
    
        const connectOptions = getConnectionObject(wallet, username);
    
        console.log("Connection Object = ", connectOptions);
    
        await gateway.connect(ccp, connectOptions);
    
        const network = await gateway.getNetwork(channelName);

        const contract = await network.getContract(chaincodeName);

        await contract.submitTransaction('doQA', args[0], args[1])
    } catch(err) {
        return err;
    } finally {
        console.log("disconnecting gateway");
        gateway.disconnect();
    }
}

invokeObjMW.package = async(
    channelName,
    chaincodeName,
    args,
    username,
    org_name
    ) => {
    const wallet = await getWallet(org_name);
    const gateway = new Gateway();
    try {
        const ccp = await registerUser.getCCP(org_name);
    
        let identity = await wallet.get(username);
        if (!identity) {
            console.log(
            `An identity for the user ${username} does not exist in the wallet, so register user before retry`
            );
            return;
        }
    
        const connectOptions = getConnectionObject(wallet, username);
    
        console.log("Connection Object = ", connectOptions);
    
        await gateway.connect(ccp, connectOptions);
    
        const network = await gateway.getNetwork(channelName);

        const contract = await network.getContract(chaincodeName);

        await contract.submitTransaction('package', args[0])
    } catch(err) {
        return err;
    } finally {
        console.log("disconnecting gateway");
        gateway.disconnect();
    }
}

invokeObjMW.dispatch = async(
    channelName,
    chaincodeName,
    args,
    username,
    org_name
    ) => {
    const wallet = await getWallet(org_name);
    const gateway = new Gateway();
    try {
        const ccp = await registerUser.getCCP(org_name);
    
        let identity = await wallet.get(username);
        if (!identity) {
            console.log(
            `An identity for the user ${username} does not exist in the wallet, so register user before retry`
            );
            return;
        }
    
        const connectOptions = getConnectionObject(wallet, username);
    
        console.log("Connection Object = ", connectOptions);

        await gateway.connect(ccp, connectOptions);
    
        const network = await gateway.getNetwork(channelName);

        const contract = await network.getContract(chaincodeName);

        await contract.submitTransaction('dispatch', args[0])
    } catch(err) {
        return err;
    } finally {
        console.log("disconnecting gateway");
        gateway.disconnect();
    }
}

module.exports = invokeObjMW;