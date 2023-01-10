// index.js
"use strict";

const helper = require("./helper");
const enrollAdmin = require("./enrollAdmin.js");
const registerUser = require("./registerUser.js");
const invokeObj = require("./invoke");

let { Gateway, Wallets } = require("fabric-network");
// const { Client } = require("fabric-client");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const wr = require("./wrInvoke");
const invokeObjMW = require("./invokeMWCC");
const queryObj = require("./query");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// ############################## QUERY BLOCKCHAIN RELATED TASKS #########################################
//  Query Get Block by BlockNumber

app.get("/qscc/channels/:channelName/chaincodes/:chaincodeName", async function (req, res) {
  try {
      console.log('==================== QUERY BY CHAINCODE ==================');

      let channelName = req.params.channelName;
      let chaincodeName = req.params.chaincodeName;

      console.log(`chaincode name is :${chaincodeName}`)
      let args = req.query.args;
      let fcn = req.query.fcn;
      // let peer = req.query.peer;

      console.log('channelName : ' + channelName);
      console.log('chaincodeName : ' + chaincodeName);
      console.log('fcn : ' + fcn);
      console.log('args : ' + args);

      if (!chaincodeName) {
        throw new Error("Chaincode name missing");
      }
      if (!channelName) {
        throw new Error("Channel name missing");
      }
      if (!fcn) {
        throw new Error("Function name missing");
      }
      if (!args) {
        throw new Error("Arguments are missing missing");
      }
      // console.log('args==========', args);
      // args = args.replace(/'/g, '"');
      // args = JSON.parse(args);
      // console.log(args);

      let response_payload = await queryObj.qscc(channelName, chaincodeName, args, fcn, req.query.username, req.query.orgname);
      // let response = Buffer.from(JSON.parse(JSON.stringify(response_payload))).toString()
      res.send(response_payload);
  } catch (error) {
      const response_payload = {
          result: null,
          error: error.name,
          errorData: error.message
      }
      res.send(response_payload)
  }
});

// ##################################### Register User #########################################################
app.post("/register/admin", async (req, res, next) => {
  try {
    let org = req.body.orgName;
    console.log(org);
    await enrollAdmin.enroll(org);
    res.json({
      message: "Successfully enrolled admin and imported it into the wallet",
    });
  } catch (err) {
    next(err);
  }
});

app.post("/register/user", async (req, res, next) => {
  try {
    let usrname = req.body.username;
    let orgName = req.body.orgName;
    console.log(orgName);
    console.log(usrname);
    let resp = await registerUser.registerEnrollUser(usrname, orgName);
    // let resp = await helper.getRegisteredUser(usrname, orgName, true);
    res.json({
      message: "Successfully enrolled User and imported it into the wallet",
    });
  } catch (err) {
    next(err);
  }
});

// ################### PMCC #######################
// app.post('/register', async(req,res,next)=>{
// console.log(req.body);
//     let usrname = req.body.username;
//     console.log("Name = ",usrname);
//     let orgName = req.body.orgName;
//     let response = await helper.registerAndGerSecret(usrname, orgName);
//     res.json(response);
// })

// app.get("/producer/getStorage", async (req, res, next) => {
//   try {
//     // console.log(__dirname);
//     let ccpPath = path.resolve(
//       __dirname,
//       "connection-profiles",
//       "mfc-prd-config.json"
//     );
//     // console.log(ccpPath);
//     let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8", (err, data) => {}));
//     // console.log("ccp = ",ccp);
//     const walletPath = path.join(process.cwd(), "teafarm-wallet");
//     const wallet = await Wallets.newFileSystemWallet(walletPath);
//     // omitting check for identity
//     const gateway = new Gateway();
//     await gateway.connect(ccp, {
//       wallet,
//       identity: "user1",
//       discovery: { enabled: true, asLocalhost: true },
//     });

//     // n/w to which contract is deployed
//     const network = await gateway.getNetwork("mfd-prd-channel");
//     // get contract
//     const contract = network.getContract("pmcc");
//     const storage = await contract.evaluateTransaction("availableStock");

//     res.json(storage);
//   } catch (err) {
//     console.log(err);
//     next(err);
//   }
// });
// ************************* PMCC ***************************************
app.get("/producer/storage", async (req, res, next) => {
  try {
    let message = await invokeObj.evaluateTx(
      "mfd-prd-channel",
      "pmcc",
      "availableStock",
      "user101",
      "tata"
    );
    res.json({ message: `Storage Of Producer = ${message}` });
  } catch (err) {
    next(err);
  }
});

app.get("/manufacturer-stock", async (req, res, next) => {
  try {
    let message = await invokeObj.evaluateTx(
      "mfd-prd-channel",
      "pmcc",
      "getManufacturerStock",
      "user101",
      "tata"
    );
    console.log(message);
    res.json({ message: `Manufacturer Stock = ${message}` });
  } catch (err) {
    next(err);
  }
});

app.get("/manufacturer-fund", async (req, res, next) => {
  try {
    let message = await invokeObj.evaluateTx(
      "mfd-prd-channel",
      "pmcc",
      "getManufacturerFunds",
      "user101",
      "tata"
    );
    res.json({ message: `Manufacturer Funds = ${message}` });
  } catch (err) {
    next(err);
  }
});

app.get("/manufacturer/order-details/:orderNumber", async (req, res, next) => {
  try {
    let orderNumber = req.params.orderNumber;
    console.log(typeof orderNumber);
    let message = await invokeObj.getOrderDetails(
      "mfd-prd-channel",
      "pmcc",
      "getOrderDetails",
      orderNumber,
      "user101",
      "tata"
    );
    res.json({ message: `Order Details For Manufacturer = ${message}` });
  } catch (err) {
    next(err);
  }
});

app.get("/init-pmcc", async (req, res, next) => {
  try {
   let txId = await invokeObj.evaluateTx(
      "mfd-prd-channel",
      "pmcc",
      "init",
      "user101",
      "tata"
    );
    res.json({ message: `Chaincode pmcc initialized with Transaction ID: ${txId}` });
  } catch (err) {
    next(err);
  }
});

app.post("/manufacture/place-order", async (req, res, next) => {
  try {
    let args = [];
    args.push(req.body.quantity);
    args.push(req.body.city);
    args.push(req.body.state);
    console.log(args);
    let result = await invokeObj.placeOrder(
      "mfd-prd-channel",
      "pmcc",
      "placeOrder",
      args,
      "user101",
      "tata"
    );
    res.json({ message: `Order Number & Transaction ID for Manufacturer =  ${result}` });
  } catch (err) {
    next(err);
  }
});

app.post("/production/transit/:orderNumber", async (req, res, next) => {
  try {
    let orderNo = req.params.orderNumber;
    let result = await invokeObj.orderInTransit(
      "mfd-prd-channel",
      "pmcc",
      "updateStatusToInTransit",
      orderNo,
      "user101",
      "tata"
    );
    res.json({ message: `Order Status Changed To In-Transit & Tx Id = ${result}` });
  } catch (err) {
    next(err);
  }
});

app.post("/production/delivered/:orderNumber", async (req, res, next) => {
  try {
    let orderNo = req.params.orderNumber;
    let result = await invokeObj.orderInTransit(
      "mfd-prd-channel",
      "pmcc",
      "updateStatusToDelivered",
      orderNo,
      "user101",
      "tata"
    );
    res.json({ message: `Order Status Changed To Delivered & Tx ID : ${result}` });
  } catch (err) {
    next(err);
  }
});

// ###################################### MWCC ##################################################

app.get("/init-mwcc", async (req, res, next) => {
  try {
    let txId = await invokeObjMW.evaluateTx(
      "mfd-whs-channel",
      "mwcc",
      "initialize",
      "user404",
      "tatastore"
    );
    res.json({ message: `MWCC Initialized & Transaction ID : ${txId}` });
  } catch (err) {
    next(err);
  }
});

app.get("/manufacturer/raw-stock-from-pmcc", async (req, res, next) => {
  try {
    let message = await invokeObjMW.evaluateTx(
      "mfd-whs-channel",
      "mwcc",
      "returnRawStockAccordingToPMCC",
      "user101",
      "tata"
    );
    res.json({ message: `manufacturer stock is ${message} Kg` });
  } catch (err) {
    next(err);
  }
});

app.get("/manufacturer/dried-stock", async (req, res, next) => {
  try {
    let message = await invokeObjMW.evaluateTx(
      "mfd-whs-channel",
      "mwcc",
      "availableDriedStock",
      "user101",
      "tata"
    );
    res.json({ message: `manufacturer dried stock is ${message} Kg` });
  } catch (err) {
    next(err);
  }
});

app.get("/manufacturer/roasted-stock", async (req, res, next) => {
  try {
    let message = await invokeObjMW.evaluateTx(
      "mfd-whs-channel",
      "mwcc",
      "availableRoastedStock",
      "user101",
      "tata"
    );
    res.json({ message: `manufacturer roasted stock is ${message} Kg` });
  } catch (err) {
    next(err);
  }
});

app.get("/manufacturer/finished-stock", async (req, res, next) => {
  try {
    let message = await invokeObjMW.evaluateTx(
      "mfd-whs-channel",
      "mwcc",
      "availableFinishedStock",
      "user101",
      "tata"
    );
    res.json({ message: `manufacturer finished stock is ${message} Kg` });
  } catch (err) {
    next(err);
  }
});

app.get("/manufacturer/wasted-stock", async (req, res, next) => {
  try {
    let message = await invokeObjMW.evaluateTx(
      "mfd-whs-channel",
      "mwcc",
      "getWastedStock",
      "user101",
      "tata"
    );
    res.json({ message: `manufacturer wasted stock is ${message} Kg` });
  } catch (err) {
    next(err);
  }
});

app.get("/manufacturer/total-packages", async (req, res, next) => {
  try {
    let message = await invokeObjMW.evaluateTx(
      "mfd-whs-channel",
      "mwcc",
      "getTotalPackages",
      "user101",
      "tata"
    );
    res.json({ message: `manufacturer total packages is ${message}` });
  } catch (err) {
    next(err);
  }
});

app.post("/manufacturer/dry", async (req, res, next) => {
  try {
    let username = req.body.username;
    let org_name = req.body.org_name;
    let args = req.body.args;
    let txId = await invokeObjMW.dry("mfd-whs-channel", "mwcc", args, username, org_name);
    res.json({ message: `${args[1]} Kg of raw stock dried & Tx Id : ${txId}` });
  } catch (err) {
    next(err);
  }
});

app.post("/manufacturer/roast", async (req, res, next) => {
  try {
    let username = req.body.username;
    let org_name = req.body.org_name;
    let args = req.body.args;
    let txId = await invokeObjMW.roast(
      "mfd-whs-channel",
      "mwcc",
      args,
      username,
      org_name
    );
    res.json({ message: `${args[1]} Kg of raw stock roasted & Tx ID : ${txId}` });
  } catch (err) {
    next(err);
  }
});

app.post("/manufacturer/doQA", async (req, res, next) => {
  try {
    let username = req.body.username;
    let org_name = req.body.org_name;
    let args = req.body.args;
    let txId = await invokeObjMW.doQA("mfd-whs-channel", "mwcc", args, username, org_name);
    res.json({ message: `${args[1]} Kg of raw stock quality checked & Tx ID : ${txId}` });
  } catch (err) {
    next(err);
  }
});

app.post("/manufacturer/package", async (req, res, next) => {
  try {
    let username = req.body.username;
    let org_name = req.body.org_name;
    let args = req.body.args;
    let txId = await invokeObjMW.package(
      "mfd-whs-channel",
      "mwcc",
      args,
      username,
      org_name
    );
    res.json({ message: `${args[0]} Kg of finished stock is packaged & Tx ID : ${txId}` });
  } catch (err) {
    next(err);
  }
});

app.post("/manufacturer/dispatch", async (req, res, next) => {
  try {
    let username = req.body.username;
    let org_name = req.body.org_name;
    let args = req.body.args;
    let txId = await invokeObjMW.dispatch(
      "mfd-whs-channel",
      "mwcc",
      args,
      username,
      org_name
    );
    res.json({ message: `${args[0]} packages are dispatched & Tx ID : ${txId}` });
  } catch (err) {
    next(err);
  }
});

// ###################################### WRCC ##################################################

app.get("/init-wrcc", async (req, res, next) => {
  try {
    let txId = await wr.evaluateTx(
      "whs-rtlr-channel",
      "wrcc",
      "initialize",
      "user202",
      "bigbazar"
    );
    res.json({ message: `Chaincode wrcc initialized & Transaction ID : ${txId}` });
  } catch (err) {
    next(err);
  }
});

app.get("/warehouse/stock", async (req, res, next) => {
  try {
    let wStock = await wr.evaluateTx(
      "whs-rtlr-channel",
      "wrcc",
      "returnWarehouseSTockAccordingTomwCC",
      "user404",
      "tatastore"
    );
    res.json(wStock);
  } catch (err) {
    next(err);
  }
});

app.get("/warehouse/balance", async (req, res, next) => {
  try {
    let wBal = await wr.evaluateTx(
      "whs-rtlr-channel",
      "wrcc",
      "getWareHouseBalance",
      "user202",
      "bigbazar"
    );
    res.json(wBal);
  } catch (err) {
    next(err);
  }
});

app.get("/retailer/balance", async (req, res, next) => {
  try {
    let bal = await wr.evaluateTx(
      "whs-rtlr-channel",
      "wrcc",
      "getRetailerBalance",
      "user202",
      "bigbazar"
    );
    res.json({ message: `Retailer Balance = ${bal}` });
  } catch (err) {
    next(err);
  }
});

app.get("/retailer/stock", async (req, res, next) => {
  try {
    let bal = await wr.evaluateTx(
      "whs-rtlr-channel",
      "wrcc",
      "getRetailerStock",
      "user202",
      "bigbazar"
    );
    res.json({ message: `Retailer Stock = ${bal}` });
  } catch (err) {
    next(err);
  }
});

app.post("/warehouse/order-transit/:orderNumber", async (req, res, next) => {
  try {
    let orderNo = req.params.orderNumber;
    let txId = await wr.orderInTransit(
      "whs-rtlr-channel",
      "wrcc",
      "updateStatusToInTransit",
      orderNo,
      "user202",
      "bigbazar"
    );
    res.json({ message: `Retailer Order Status Changed To In-Transit & Tx ID : ${txId}` });
  } catch (err) {
    next(err);
  }
});

app.post("/retailer/place-order", async (req, res, next) => {
  try {
    let args = [];
    args.push(req.body.quantity);
    args.push(req.body.country);
    args.push(req.body.state);
    console.log(args);
    let result = await wr.placeOrder(
      "whs-rtlr-channel",
      "wrcc",
      "placeOrder",
      args,
      "user202",
      "bigbazar"
    );
    console.log(result);
    res.json({
      message: `Order Number for Reatailer =  ${result.result.orderNumber} & Tx ID : ${result.txId}`,
    });
  } catch (err) {
    next(err);
  }
});

app.post("/warehouse/order-delivered/:orderNumber", async (req, res, next) => {
  try {
    let orderNo = req.params.orderNumber;
    let status = await wr.orderDelivered(
      "whs-rtlr-channel",
      "wrcc",
      "updateStatusToDelivered",
      orderNo,
      "user202",
      "bigbazar"
    );
    res.json({ message: "Retailer Order Status Changed To Delivered" });
  } catch (err) {
    next(err);
  }
});

app.get("/warehouse/order-details/:orderNumber", async (req, res, next) => {
  try {
    let orderNo = req.params.orderNumber;
    let orderObj = await wr.getOrderDetails(
      "whs-rtlr-channel",
      "wrcc",
      "getOrderDetails",
      orderNo,
      "user202",
      "bigbazar"
    );
    res.json({ message: orderObj });
  } catch (err) {
    next(err);
  }
});

// ###################################### Server listening ##################################################

app.listen(1080, () => {
  console.log("======== Server Listening At 1080 =======");
});
