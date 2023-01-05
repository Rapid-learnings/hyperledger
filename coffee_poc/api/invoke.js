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

const invokeObj = {};

const getCCP = async (org) => {
  let ccpPath;
  if (org == "teafarm") {
    ccpPath = path.join(process.cwd(), './connection-profiles/mfc-prd-config.json');
  } else if (org == "tata") {
    ccpPath = path.join(process.cwd(), './connection-profiles/mfc-prd-config.json');
  } else return null;
  const ccpJSON = fs.readFileSync(ccpPath, "utf8");
  const ccp = JSON.parse(ccpJSON);
  return ccp;
};

const getWalletPath = async (org) => {
  let walletPath;
  if (org == "tata") {
    walletPath = path.join(process.cwd(), "./tata-wallet");
  } else if (org == "teafarm") {
    walletPath = path.join(process.cwd(), "./teafarm-wallet");
  } else return null;
  return walletPath;
};

const getWallet = async (org_name) => {
  console.log(org_name);
  let walletPath = await getWalletPath(org_name);
  console.log(walletPath);
  let wallet = await Wallets.newFileSystemWallet(walletPath);
  // console.log(wallet);
  return wallet;
  // console.log(`Wallet path: ${walletPath}`);
};

const getConnectionObject = (wallet, username) => {
  const connObj = {
    wallet:wallet,
    identity: username,
    discovery: { enabled: true, asLocalhost: true } 
    // eventHandlerOptions: EventStrategies.NONE
  };
  return connObj;
};

invokeObj.evaluateTx = async (
  channelName,
  chaincodeName,
  fcn,
  username,
  org_name
) => {
  try {
    const ccp = await getCCP(org_name);

    const wallet = await getWallet(org_name);

    // let identity = await wallet.get(username);
    // if (!identity) {
    //   console.log(
    //     `An identity for the user ${username} does not exist in the wallet, so register user before retry`
    //   );
    // await registerUser.registerEnrollUser(username, org_name);
    // identity = await wallet.get(username);
    // console.log("Run the registerUser.js application before retrying");
    //   return;
    // }

    const connectOptions = getConnectionObject(wallet, username);

    console.log("Connection Object = ", connectOptions);

    const gateway = new Gateway();
    await gateway.connect(ccp, connectOptions);

    const network = await gateway.getNetwork(channelName);
    // console.log("N/w = ",network);
    const contract = await network.getContract(chaincodeName);
    // console.log("Contract  = ", contract);
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
        let block = { BlockNumber: result.toString() };
        console.log(block);
        result = result.toString();
        break;
      case "getManufacturerStock":
        result = await contract.evaluateTransaction(fcn);
        result = JSON.parse(result);
        console.log(result);
        break;
      case "getManufacturerFunds":
        result = await contract.evaluateTransaction(fcn);
        result = JSON.parse(result);
        break;
      case "init":
        await contract.submitTransaction(fcn,"10000");
        break;
      // case "placeOrder":
      //   result = await contract.submitTransaction(fcn, )
      default:
        break;
    }

    await gateway.disconnect();

    // result = JSON.parse(result.toString());

    // let response = {
    //   message: message,
    //   result,
    // };

    return result;
  } catch (error) {
    console.log(`Getting error: ${error}`);
    return error.message;
  }
};

invokeObj.placeOrder = async (
  channelName,
  chaincodeName,
  fcn,
  args,
  username,
  org_name
) => {
  try {
    const gateway = new Gateway();
    console.log(fcn, args, username, org_name);
    const ccp = await getCCP(org_name);
    let wallet = await getWallet(org_name);
    const connectOptions = await getConnectionObject(wallet, username);
    await gateway.connect(ccp, connectOptions);
    let network = await gateway.getNetwork("mfd-prd-channel");
    let contract = await network.getContract("pmcc");

    let result;

    console.log(args);
    result = await contract.submitTransaction(
      "placeOrder",
      args[0],
      args[1],
      args[2]
    );
    console.log(result);
    const listener = async (event) => {
      if (event.eventName === "placeOrder") {
        const details = event.payload.toString("utf8");
        event = JSON.parse(details);
        console.log(
          "************************ Start placeOrder Event **********************************"
        );
        console.log(`order number: ${JSON.parse(result.toString())}`);
        console.log(`amount: ${event.amount}`);
        console.log(`quantity: ${event.quantity}`);
        console.log(`status: ${event.orderStatus}`);
        console.log(`country: ${event.country}`);
        console.log(`state: ${event.state}`);
        console.log(
          "************************ End placeOrder Event ************************************"
        );
        // Run business process to handle orders
      }
    };
    await contract.addContractListener(listener);

    await gateway.disconnect();
    result = result.toString();
    return result;
  } catch (err) {
    return err;
  }
};

invokeObj.getOrderDetails = async (
  channelName,
  chaincodeName,
  fcn,
  orderNumber,
  username,
  org_name
) => {
  try {
    const ccp = await getCCP(org_name);
    const wallet = await getWallet(org_name);
    // let identity = await wallet.get(username);
    // if (!identity) {
    //   //check if user is registered or not
    //   throw new Error(
    //     `The identity ${username} does not exist, register & try again`
    //   );
    // }
    const connectionOptions = getConnectionObject(wallet, username);
    const gateway = new Gateway();
    await gateway.connect(ccp, connectionOptions);
    const network = await gateway.getNetwork(channelName);
    const chainCode = await network.getContract(chaincodeName);
    let result = await chainCode.submitTransaction(fcn, orderNumber);
    await gateway.disconnect();
    result = result.toString();
    console.log("Order Details = ",result);
    return result;
  } catch (err) {
    return err;
  }
};

invokeObj.orderInTransit = async (
  channelName,
  chaincodeName,
  fcn,
  orderNumber,
  username,
  org_name
) => {
  try {
    const ccp = await getCCP(org_name);
    const wallet = await getWallet(org_name);
    // let identity = await wallet.get(username);
    // if (!identity) {
    //   //check if user is registered or not
    //   throw new Error(
    //     `The identity ${username} does not exist, register & try again`
    //   );
    // }
    const connectionOptions = getConnectionObject(wallet, username);
    const gateway = new Gateway();
    await gateway.connect(ccp, connectionOptions);
    const network = await gateway.getNetwork(channelName);
    const chainCode = await network.getContract(chaincodeName);
    let result = await chainCode.submitTransaction(fcn, orderNumber);
    await gateway.disconnect();
    result = result.toString();
    console.log("Order Details = ",result);
    return result;
  } catch (err) {
    return err;
  }
};

invokeObj.orderDelivered = async (
  channelName,
  chaincodeName,
  fcn,
  orderNumber,
  username,
  org_name
) => {
  try {
    const ccp = await getCCP(org_name);
    const wallet = await getWallet(org_name);
    // let identity = await wallet.get(username);
    // if (!identity) {
    //   //check if user is registered or not
    //   throw new Error(
    //     `The identity ${username} does not exist, register & try again`
    //   );
    // }
    const connectionOptions = getConnectionObject(wallet, username);
    const gateway = new Gateway();
    await gateway.connect(ccp, connectionOptions);
    const network = await gateway.getNetwork(channelName);
    const chainCode = await network.getContract(chaincodeName);
    let result = await chainCode.submitTransaction(fcn, orderNumber);
    await gateway.disconnect();
    result = result.toString();
    console.log("Order Details = ",result);
    return result;
  } catch (err) {
    return err;
  }
};


module.exports = invokeObj;
// exports.invokeTransaction = invokeTransaction;
