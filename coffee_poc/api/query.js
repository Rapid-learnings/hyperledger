const util = require("util");
const helperObj = require("./helper");
const { Gateway, Wallets } = require("fabric-network");
const { BlockDecoder } = require("fabric-common");
const fs = require("fs");

const queryObj = {};

queryObj.qscc = async (
  channelName,
  chaincodeName,
  args,
  fcn,
  username,
  org_name
) => {
  console.log("====query.js====", org_name, username);
  try {
    const ccp = await helperObj.getCCP(org_name); //JSON.parse(ccpJSON);
    // Create a new file system based wallet for managing identities.
    const walletPath = await helperObj.getWalletPath(org_name); //.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    let identity = await wallet.get(username);
    if (!identity) {
      console.log(
        `An identity for the user ${username} does not exist in the wallet, so registering user`
      );
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: username,
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork(channelName);
    //   console.log("================network===============\n");

    // fixing chaincode name to qscc  which is for ledger and other Fabric-related queries
    const contract = network.getContract(chaincodeName);
    //   console.log("================Contract===============\n", contract);
    let result;

    if (fcn == "GetBlockByNumber") {
      result = await contract.evaluateTransaction(fcn, channelName, args);
      fs.writeFileSync("./data/blockData.block", result);

      let runScript = () =>
        new Promise((resolve, reject) => {
          const { exec } = require("child_process");
          exec("sh block-decoder.sh", (error, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
            if (error !== null) {
              console.log(`exec error: ${error}`);
              reject(false);
            } else {
              resolve(true);
            }
          });
        });

      result = await runScript();
      result = fs.readFileSync("./block.json");

      result = JSON.parse(result.toString("utf-8"));
      // result = BlockDecoder.decode(result);
    } else if (fcn == "GetTransactionByID") {
      console.log("Enter");
      result = await contract.evaluateTransaction(fcn, channelName, args);
      fs.writeFileSync("./data/transactionData.block", result);

      let runScript = () =>
        new Promise((resolve, reject) => {
          const { exec } = require("child_process");
          exec("sh transaction-decoder.sh", (error, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
            if (error !== null) {
              console.log(`exec error: ${error}`);
              reject(false);
            } else {
              resolve(true);
            }
          });
        });

      result = await runScript();
      result = fs.readFileSync("./transaction.json");
      result = JSON.parse(result);
      // result = BlockDecoder.decodeTransaction(result);
    }

    return result;
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    return error.message;
  }
};

module.exports = queryObj;
