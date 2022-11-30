const {
  Gateway,
  Wallets,
  TxEventHandler,
  GatewayOptions,
  DefaultEventHandlerStrategies,
  TxEventHandlerFactory,
} = require("fabric-network");
const fs = require("fs");
const EventStrategies = require("fabric-network/lib/impl/event/defaulteventhandlerstrategies");
const path = require("path");
const log4js = require("log4js");
const logger = log4js.getLogger("BasicNetwork");
const util = require("util");
const { blockListener, contractListener } = require("./Listener");
const registerUser = require("./registerUser");


const invokeTransaction = async (
  channelName,
  chaincodeName,
  fcn,
  args,
  username,
  org_name
) => {
  try {
    const ccp = await registerUser.getCCP(org_name);
    console.log(
      "==================",
      channelName,
      chaincodeName,
      fcn,
      args,
      username,
      org_name
    );

    const walletPath = await registerUser.getWalletPath(org_name);
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    let identity = await wallet.get(username);
    if (!identity) {
      console.log(
        `An identity for the user ${username} does not exist in the wallet, so register user before retry`
      );      
      // await registerUser.registerEnrollUser(username, org_name);
      // identity = await wallet.get(username);
      // console.log("Run the registerUser.js application before retrying");
      return;
    }

    const connectOptions = {
      wallet,
      identity: username,
      discovery: { enabled: true, asLocalhost: false },
      // eventHandlerOptions: EventStrategies.NONE
    };

    console.log("Connection Object = ",connectOptions);

    const gateway = new Gateway();
    await gateway.connect(ccp, connectOptions);

    const network = await gateway.getNetwork(channelName);
    console.log("N/w = ",network);
    const contract = network.getContract(chaincodeName);
    console.log("Contract  = ", contract);
    // Important: Please dont set listener here, I just showed how to set it. If we are doing here, it will set on every invoke call.
    // Instead create separate function and call it once server started, it will keep listening.
    // await contract.addContractListener(contractListener);
    // await network.addBlockListener(blockListener);

    // Multiple smartcontract in one chaincode
    let result;
    let message;

    switch (fcn) {
      case "availableStock":
        result = await contract.evaluateTransaction(fcn);
        result = { txid: result.toString() };
        break;
      case "init":
        await contract.submitTransaction(fcn,"10000");
        break;
      default:
        break;
    }

    await gateway.disconnect();

    // result = JSON.parse(result.toString());

    let response = {
      message: message,
      result,
    };

    return response;
  } catch (error) {
    console.log(`Getting error: ${error}`);
    return error.message;
  }
};

exports.invokeTransaction = invokeTransaction;
