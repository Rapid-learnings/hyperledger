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

const wr = {};

const getCCP = async (org) => {
  let ccpPath;
  if (org == "tatastore") {
    ccpPath = path.join(
      process.cwd(),
      "./connection-profiles/whs-rtlr-config.json"
    );
  } else if (org == "bigbazar") {
    ccpPath = path.join(
      process.cwd(),
      "./connection-profiles/whs-rtlr-config.json"
    );
  } else return null;
  const ccpJSON = fs.readFileSync(ccpPath, "utf8");
  const ccp = JSON.parse(ccpJSON);
  return ccp;
};

const getWalletPath = async (org) => {
  let walletPath;
  if (org == "tatastore") {
    walletPath = path.join(process.cwd(), "./tatastore-wallet");
  } else if (org == "bigbazar") {
    walletPath = path.join(process.cwd(), "./bigbazar-wallet");
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
    wallet: wallet,
    identity: username,
    discovery: { enabled: true, asLocalhost: true },
    // eventHandlerOptions: EventStrategies.NONE
  };
  return connObj;
};

wr.evaluateTx = async (channelName, chaincodeName, fcn, username, org_name) => {
  try {
    const ccp = await getCCP(org_name);

    const wallet = await getWallet(org_name);

    const connectOptions = getConnectionObject(wallet, username);

    console.log("Connection Object = ", connectOptions);

    const gateway = new Gateway();
    await gateway.connect(ccp, connectOptions);

    const network = await gateway.getNetwork("whs-rtlr-channel");
    // console.log("N/w = ",network);
    const contract = await network.getContract("wrcc");

    let result;
    let message;

    switch (fcn) {
      case "returnWarehouseSTockAccordingTomwCC":
        result = await contract.evaluateTransaction(fcn);
        result = result.toString();
        break;
      case "getRetailerBalance":
        result = await contract.evaluateTransaction(fcn);
        result = JSON.parse(result);
        console.log(result);
        break;
      case "getRetailerStock":
        result = await contract.evaluateTransaction(fcn);
        result = JSON.parse(result);
        break;
      case "getWareHouseBalance":
        result = await contract.evaluateTransaction(fcn);
        result = JSON.parse(result);
        break;
      case "initialize":
        await contract.submitTransaction(fcn);
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

wr.placeOrder = async (
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
    let network = await gateway.getNetwork("whs-rtlr-channel");
    let contract = await network.getContract("wrcc");

    let result;

    console.log(args);
    await contract.submitTransaction(
      "placeOrder",
      args[0],
      args[1],
      args[2]
    );
    const listener = async (event) => {
      if (event.eventName === "place-order") {
        const details = event.payload.toString("utf8");
        console.log("details = ", details);
        event = JSON.parse(details);
        console.log("event = ", event);
        // Run business process to handle orders
        result = event;
      }
    };
    await contract.addContractListener(listener);

    await gateway.disconnect();
    console.log("result",result);
    return result;
  } catch (err) {
    return err;
  }
};

wr.orderInTransit = async (
  channelName,
  chaincodeName,
  fcn,
  orderNumber,
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
    let network = await gateway.getNetwork("whs-rtlr-channel");
    let contract = await network.getContract("wrcc");

    let result;

    console.log(args);
    result = await contract.submitTransaction(
      "updateStatusToInTransit",
      orderNumber
    );
    console.log(result);
    await gateway.disconnect();
    result = result.toString();
    return result;
  } catch (err) {
    return err;
  }
};

wr.orderDelivered = async (
  channelName,
  chaincodeName,
  fcn,
  orderNumber,
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
    let network = await gateway.getNetwork("whs-rtlr-channel");
    let contract = await network.getContract("wrcc");

    let result;

    console.log(args);
    result = await contract.submitTransaction(
      "updateStatusToDelivered",
      orderNumber
    );
    console.log(result);
    await gateway.disconnect();
    result = result.toString();
    return result;
  } catch (err) {
    return err;
  }
};

wr.getOrderDetails = async (
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
    const connectionOptions = getConnectionObject(wallet, username);
    const gateway = new Gateway();
    await gateway.connect(ccp, connectionOptions);
    const network = await gateway.getNetwork(channelName);
    const chainCode = await network.getContract(chaincodeName);
    let result = await chainCode.submitTransaction(fcn, orderNumber);
    await gateway.disconnect();
    result = result.toString();
    console.log("Order Details = ", result);
    return result;
  } catch (err) {
    return err;
  }
};

module.exports = wr;
// exports.invokeTransaction = invokeTransaction;
