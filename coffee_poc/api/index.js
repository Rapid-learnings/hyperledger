// index.js
"use strict";

const helper = require("./helper");
const enrollAdmin = require("./enrollAdmin.js");
const registerUser = require("./registerUser.js");
const invokeObj = require("./invoke");

var { Gateway, Wallets } = require("fabric-network");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const wr = require("./wrInvoke");

const app = express();
// app.use(bodyParser);
// app.use(bodyParser.urlencoded({
//     extended: false
// }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.post("/register/admin", async (req, res, next) => {
  let org = req.body.orgName;
  console.log(org);
  let resp = await enrollAdmin.enroll(org);
  res.json(resp);
});

app.post("/register/user", async (req, res, next) => {
  let usrname = req.body.username;
  let orgName = req.body.orgName;
  console.log(orgName);
  console.log(usrname);
  let resp = await registerUser.registerEnrollUser(usrname, orgName);
  // let resp = await helper.getRegisteredUser(usrname, orgName, true);
  res.json(resp);
});

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
//     throw err;
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
    throw err;
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
    throw err;
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
    throw err;
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
    throw err;
  }
});

app.get("/init-pmcc", async (req, res, next) => {
  try {
    await invokeObj.evaluateTx(
      "mfd-prd-channel",
      "pmcc",
      "init",
      "user101",
      "tata"
    );
    res.json({ message: "Chaincode pmcc initialized" });
  } catch (err) {
    throw err;
  }
});

app.post("/manufacture/place-order", async (req, res, next) => {
  try {
    let args = [];
    args.push(req.body.quantity);
    args.push(req.body.city);
    args.push(req.body.state);
    let result = await invokeObj.placeOrder(
      "mfd-prd-channel",
      "pmcc",
      "placeOrder",
      args,
      "user101",
      "tata"
    );
    res.json({ message: `Order Number for Manufacturer =  ${result}` });
  } catch (err) {
    throw err;
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
    res.json({ message: `Order Status Changed To In-Transit` });
  } catch (err) {
    throw err;
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
    res.json({ message: `Order Status Changed To Delivered` });
  } catch (err) {
    throw err;
  }
});

// ###################################### MWCC ##################################################

// ###################################### WRCC ##################################################

app.get("/init-wrcc", async (req, res, next) => {
  try {
    await wr.evaluateTx(
      "whs-rtlr-channel",
      "wrcc",
      "initialize",
      "user202",
      "bigbazar"
    );
    res.json({ message: "Chaincode wrcc initialized" });
  } catch (err) {
    throw err;
  }
});

app.get("/warehouse/stock", async (req, res, next) => {
  try {
    let wStock = await wr.evaluateTx(
      "whs-rtlr-channel",
      "wrcc",
      "availableWarehouseStock",
      "user202",
      "bigbazar"
    );
    res.json(wStock);
  } catch (err) {
    throw err;
  }
});

app.get('/warehouse/balance', async(req,res,next)=>{
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
    throw err;
  }
})

app.get("/retailer/balance", async(req,res,next)=>{
  try{
    let bal = await wr.evaluateTx(
      "whs-rtlr-channel",
      "wrcc",
      "getRetailerBalance",
      "user202",
      "bigbazar"
    );
    res.json({message:`Retailer Balance = ${bal}`});
  }catch(err){
    throw err;
  }
})

app.get("/retailer/stock", async(req,res,next)=>{
  try{
    let bal = await wr.evaluateTx(
      "whs-rtlr-channel",
      "wrcc",
      "getRetailerStock",
      "user202",
      "bigbazar"
    );
    res.json({message:`Retailer Stock = ${bal}`});
  }catch(err){
    throw err;
  }
})

app.post("/warehouse/order-transit/:orderNumber", async (req, res, next) => {
  try {
    let orderNo = req.params.orderNumber;
    let status = await wr.orderInTransit(
      "whs-rtlr-channel",
      "wrcc",
      "updateStatusToInTransit",
      orderNo,
      "user202",
      "bigbazar"
    );
    res.json({ message: "Retailer Order Status Changed To In-Transit" });
  } catch (err) {
    throw err;
  }
});

app.post('/retailer/place-order', async(req,res,next)=>{
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
    res.json({ message: `Order Number for Reatailer =  ${result.orderNumber}` });
  } catch (err) {
    throw err;
  }
})

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
    throw err;
  }
});

app.get('/warehouse/order-details/:orderNumber', async(req,res,next)=>{
  try{
    let orderNo = req.params.orderNumber;
    let orderObj = await wr.getOrderDetails(
      "whs-rtlr-channel",
        "wrcc",
        "getOrderDetails",
        orderNo,
        "user202",
        "bigbazar"
    );
    res.json({message:orderObj});
  }catch(err){
    throw err;
  }
})


// ###################################### Server listening ##################################################

app.listen(1080, () => {
  console.log("======== Server Listening At 1080 =======");
});
