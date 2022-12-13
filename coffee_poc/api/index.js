// index.js
"use strict";

const helper = require("./helper");
const enrollAdmin = require("./enrollAdmin.js");
const registerUser = require("./registerUser.js");
const invokeObj = require("./invoke");
const invokeObjMW = require("./invokeMWCC.js");
const wr = require("./mwinvoke")

var { Gateway, Wallets } = require("fabric-network");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
// app.use(bodyParser);
// app.use(bodyParser.urlencoded({
//     extended: false
// }));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors());

//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// PMCC ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

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
    let message = await invokeObj.getOrderDetails(
      "mfd-prd-channel",
      "pmcc",
      "getOrderDetails",
      orderNumber,
      "user1",
      "tata"
    );
    res.json({ message: `Order Details For Manufacturer = ${message}` });
  } catch (err) {
    throw err;
  }
});

app.get("init-pmcc", async (req, res, next) => {
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
      "user1",
      "tata"
    );
    res.json({ message: `Order Number for Manufacturer =  ${result}` });
  } catch (err) {
    throw err;
  }
});

//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// MWCC ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

app.post('init-mwcc', async (req, res, next) => {
  try {
    let username = req.body.username;
    let org_name = req.body.org_name;
    await invokeObjMW.evaluateTx(
      "mfd-whs-channel",
      "mwcc",
      "initialize",
      username,
      org_name
    );
    res.json({message: `Chaincode mwcc initialized`});
  } catch (err) {
    throw err;
  }
})

app.get("/manufacturer/raw-stock-from-pmcc", async (req, res, next) => {
  try {
    let username = req.body.username;
    let org_name = req.body.org_name;
    let message = await invokeObjMW.evaluateTx(
      "mfd-whs-channel",
      "mwcc",
      "returnRawStockAccordingToPMCC",
      username,
      org_name
    );
    res.json({message: `manufacturer stock is ${message} Kg`});
  } catch (err) {
    throw err;
  }
});

app.get("/manufacturer/dried-stock", async (req, res, next) => {
  try {
    let username = req.body.username;
    let org_name = req.body.org_name;
    let message = await invokeObjMW.evaluateTx(
      "mfd-whs-channel",
      "mwcc",
      "availableDriedStock",
      username,
      org_name
    );
    res.json({message: `manufacturer dried stock is ${message} Kg`});
  } catch (err) {
    throw err;
  }
});

app.get("/manufacturer/roasted-stock", async (req, res, next) => {
  try {
    let username = req.body.username;
    let org_name = req.body.org_name;
    let message = await invokeObjMW.evaluateTx(
      "mfd-whs-channel",
      "mwcc",
      "availableRoastedStock",
      username,
      org_name
    );
    res.json({message: `manufacturer roasted stock is ${message} Kg`});
  } catch (err) {
    throw err;
  }
});

app.get("/manufacturer/finished-stock", async (req, res, next) => {
  try {
    let username = req.body.username;
    let org_name = req.body.org_name;
    let message = await invokeObjMW.evaluateTx(
      "mfd-whs-channel",
      "mwcc",
      "availableFinishedStock",
      username,
      org_name
    );
    res.json({message: `manufacturer finished stock is ${message} Kg`});
  } catch (err) {
    throw err;
  }
});

app.get("/manufacturer/wasted-stock", async (req, res, next) => {
  try {
    let username = req.body.username;
    let org_name = req.body.org_name;
    let message = await invokeObjMW.evaluateTx(
      "mfd-whs-channel",
      "mwcc",
      "getWastedStock",
      username,
      org_name
    );
    res.json({message: `manufacturer wasted stock is ${message} Kg`});
  } catch (err) {
    throw err;
  }
});

app.get("/manufacturer/total-packages", async (req, res, next) => {
  try {
    let username = req.body.username;
    let org_name = req.body.org_name;
    let message = await invokeObjMW.evaluateTx(
      "mfd-whs-channel",
      "mwcc",
      "getTotalPackages",
      username,
      org_name
    );
    res.json({message: `manufacturer total packages is ${message}`});
  } catch (err) {
    throw err;
  }
});

app.get("/warehouse/stock", async (req, res, next) => {
  try {
    let username = req.body.username;
    let org_name = req.body.org_name;
    let message = await invokeObjMW.evaluateTx(
      "mfd-whs-channel",
      "mwcc",
      "getWarehouseStock",
      username,
      org_name
    );
    res.json({message: `warehouse stock is ${message} packages`});
  } catch (err) {
    throw err;
  }
});

app.post("/manufacturer/dry", async (req, res, next) => {
  try {
    let username = req.body.username;
    let org_name = req.body.org_name;
    let args = req.body.args;
    await invokeObjMW.dry(
      "mfd-whs-channel",
      "mwcc",
      args,
      username,
      org_name
    );
    res.json({message: `${args[0]} Kg of raw stock dried with ${args[1]} Kg loss`});
  } catch (err) {
    throw err;
  }
});

app.post("/manufacturer/roast", async (req, res, next) => {
  try {
    let username = req.body.username;
    let org_name = req.body.org_name;
    let args = req.body.args;
    await invokeObjMW.roast(
      "mfd-whs-channel",
      "mwcc",
      args,
      username,
      org_name
    );
    res.json({message: `${args[0]} Kg of raw stock roasted with ${args[1]} Kg loss`});
  } catch (err) {
    throw err;
  }
});

app.post("/manufacturer/doQA", async (req, res, next) => {
  try {
    let username = req.body.username;
    let org_name = req.body.org_name;
    let args = req.body.args;
    await invokeObjMW.doQA(
      "mfd-whs-channel",
      "mwcc",
      args,
      username,
      org_name
    );
    res.json({message: `${args[0]} Kg of raw stock quality checked with ${args[1]} Kg rejected`});
  } catch (err) {
    throw err;
  }
});

app.post("/manufacturer/package", async (req, res, next) => {
  try {
    let username = req.body.username;
    let org_name = req.body.org_name;
    let args = req.body.args;
    await invokeObjMW.package(
      "mfd-whs-channel",
      "mwcc",
      args,
      username,
      org_name
    );
    res.json({message: `${args[0]} Kg of finished stock is packaged`});
  } catch (err) {
    throw err;
  }
});

app.post("/manufacturer/dispatch", async (req, res, next) => {
  try {
    let username = req.body.username;
    let org_name = req.body.org_name;
    let args = req.body.args;
    await invokeObjMW.dispatch(
      "mfd-whs-channel",
      "mwcc",
      args,
      username,
      org_name
    );
    res.json({message: `${args[0]} packages are dispatched`});
  } catch (err) {
    throw err;
  }
});

//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// WRCC ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

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
    next(err);
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
    next(err);
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
    next(err);
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
    next(err);
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
    next(err);
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
    next(err);
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
    next(err);
  }
})

app.listen(1080, () => {
  console.log("======== Server Listening At 1080 =======");
});
