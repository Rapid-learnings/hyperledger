/*
SPDX-License-Identifier: Apache-2.0
*/

"use strict";

let { Contract } = require("fabric-contract-api");
let processKey = "processing-stock";
let rawstockKey = "raw-stock";
let driedstockKey = "dried-stock";
let roastedstockKey = "roasted-stock";
let finishedstockKey = "finished-stock";
let wasteKey = "wasted-stock";
let whareHouseStock = "WHAREHOUSE_STOCK";
let packSize = 50; // Kg
let totalPackages = "number-of-packages";
let status = ["READY_FOR_DISPATCH", "DISPATCHED"];

class mwcc extends Contract {
  // intializes stock to a fixed amount
  async initialize(ctx) {
    console.log("===== Initializing all stocks =====");
    // const currentStock = await this.updateRawSTockAccordingToPMCC(ctx);
    await ctx.stub.putState(rawstockKey, Buffer.from("0")); //link this to pmcc.js
    await ctx.stub.putState(driedstockKey, Buffer.from("0"));
    await ctx.stub.putState(processKey, Buffer.from("0"));
    await ctx.stub.putState(roastedstockKey, Buffer.from("0"));
    await ctx.stub.putState(finishedstockKey, Buffer.from("0"));
    await ctx.stub.putState(wasteKey, Buffer.from("0"));
    await ctx.stub.putState(totalPackages, Buffer.from("0"));
    await ctx.stub.putState(whareHouseStock, Buffer.from("0"));
    console.log("===== Initialized all Stocks to 0 =====");
  }

  async returnRawStockAccordingToPMCC(ctx) {
    const process = await this.getProcessStock(ctx);

    // Query the Manufacturers stock from pmcc
    const response = await ctx.stub.invokeChaincode(
      "pmcc",
      ["getManufacturerStock"],
      "mfd-prd-channel"
    );
    // Extract value from the response object
    const currentManufacturerStockInPMCC = response.payload.toString();
    const stock = parseInt(currentManufacturerStockInPMCC);
    console.log(
      "current manufacturers raw stock according to PMCC is %s",
      stock
    );
    // return currentManufacturerStockInPMCC;
    let rawStock = stock - process;
    console.log(
      "After accounting for processed stock the raw stock is %s",
      rawStock
    );

    return rawStock;
  }

  async updateRawStock(ctx, amt, flag) {
    // let clientMSPID = await ctx.clientIdentity.getMSPID();
    // if (clientMSPID !== 'tataMSP') {
    //     throw new Error('only Manufacturer can update stock');
    // }
    let currentStockBytes = await ctx.stub.getState(rawstockKey);
    let currentStock = parseInt(currentStockBytes.toString());

    let amount = parseInt(amt);
    let stock;
    if (flag == 1 && currentStock < amount) {
      throw new Error("Cannot deduct amount greater than stock");
    }
    if (flag == 0) {
      // if flag is 0 then add
      stock = currentStock + amount;
    } else {
      // if flag is 1 then deduct
      stock = currentStock - amount;
    }
    // Store the new state in the blockchain
    await ctx.stub.putState(rawstockKey, Buffer.from(stock.toString()));
    // return stock;
  }

  // Queries available raw stock
  async availableRawStock(ctx) {
    // let clientMSPID = await ctx.clientIdentity.getMSPID();
    // if (clientMSPID !== 'tataMSP') {
    //     throw new Error('only Manufacturer can check available stock')
    // }
    // const rawStock = await this.returnRawStockAccordingToPMCC(ctx);
    // return rawStock;

    let ASBytes = await ctx.stub.getState(rawstockKey);
    let AS = parseInt(ASBytes.toString());
    console.log("Available Stock is %s kg", AS);
    return AS;
  }

  async availableDriedStock(ctx) {
    // let clientMSPID = await ctx.clientIdentity.getMSPID();
    // if (clientMSPID !== 'tataMSP') {
    //     throw new Error('only Manufacturer can check available stock')
    // }
    let ASBytes = await ctx.stub.getState(driedstockKey);
    let AS = parseInt(ASBytes.toString());
    console.log("Available Stock is %s kg", AS);
    return AS;
  }

  async availableRoastedStock(ctx) {
    // let clientMSPID = await ctx.clientIdentity.getMSPID();
    // if (clientMSPID !== 'tataMSP') {
    //     throw new Error('only Manufacturer can check available stock')
    // }
    let ASBytes = await ctx.stub.getState(roastedstockKey);
    let AS = ASBytes.toString();
    console.log("Available Stock is %s kg", AS);
    return AS;
  }

  async availableFinishedStock(ctx) {
    let ASBytes = await ctx.stub.getState(finishedstockKey);
    let AS = parseInt(ASBytes.toString());
    console.log("Available Stock is %s kg", AS);
    return AS;
  }

  async updateFinishedStock(ctx, qty, flag) {
    if (flag == 1) {
      let finishedStock = await this.availableFinishedStock(ctx);
      finishedStock = parseInt(finishedStock);
      let newFinishedStock = finishedStock - qty;
      await ctx.stub.putState(
        finishedstockKey,
        Buffer.from(newFinishedStock.toString())
      );
    } else if (flag == 0) {
      let finishedStock = await this.availableFinishedStock(ctx);
      finishedStock = parseInt(finishedStock);
      let newFinishedStock = finishedStock + qty;
      await ctx.stub.putState(
        finishedstockKey,
        Buffer.from(newFinishedStock.toString())
      );
    }
  }

  async updateRoastedStock(ctx, qty, flag) {
    if (flag == 1) {
      let roastedStock = await this.availableRoastedStock(ctx);
      roastedStock = parseInt(roastedStock);
      let newRoastedStock = roastedStock - qty;
      await ctx.stub.putState(
        roastedstockKey,
        Buffer.from(newRoastedStock.toString())
      );
    } else if (flag == 0) {
      let roastedStock = await this.availableRoastedStock(ctx);
      roastedStock = parseInt(roastedStock);
      let newRoastedStock = roastedStock + qty;
      await ctx.stub.putState(
        roastedstockKey,
        Buffer.from(newRoastedStock.toString())
      );
    }
  }

  async updateWastedStock(ctx, qty) {
    const stockBytes = await ctx.stub.getState(wasteKey);
    const stock = parseInt(stockBytes.toString());
    const quantity = parseInt(qty.toString());
    const newStock = stock + quantity;
    await ctx.stub.putState(wasteKey, Buffer.from(newStock.toString()));
  }

  async getWastedStock(ctx) {
    const stock = await ctx.stub.getState(wasteKey);
    const st = parseInt(stock.toString());
    return st;
  }

  async getProcessStock(ctx) {
    const stock = await ctx.stub.getState(processKey);
    const st = parseInt(stock.toString());
    return st;
  }

  async updateProcessing(ctx, qty) {
    const stockBytes = await ctx.stub.getState(processKey);
    const stock = parseInt(stockBytes.toString());
    const quantity = parseInt(qty.toString());
    const newStock = stock + quantity;
    await ctx.stub.putState(processKey, Buffer.from(newStock.toString()));
  }

  // here -> weightIn is coffee sent for drying.
  // weightOut -> coffee received after drying process.
  // this function basically updates raw stock on basis of dried coffee.
  async dry(ctx, weightIn, weightOut) {
    // let clientMSPID = await ctx.clientIdentity.getMSPID()
    // if (clientMSPID !== 'tataMSP') {
    //     throw new Error('Only Manufacturer can process the material');
    // }
    let wti = parseInt(weightIn);
    let wto = parseInt(weightOut);
    if (wti < wto) {
      throw new Error("Invalid weights");
    }

    const rawStock = await this.availableRawStock(ctx);
    if (rawStock < wti) {
      throw new Error("Stock is less in drying process, current = ", rawStock);
    }
    await this.updateRawStock(ctx, wti, 1);

    let diff = wti - wto;
    await this.updateWastedStock(ctx, diff);
    /*
        Before Updating the raw stock we must first query the pmcc chaincode and update
        any newly ordered stock.
        */

    // await this.updateRawStock(ctx, weightIn, 1);

    // Fetch and update the dried stock
    const driedStock = await this.availableDriedStock(ctx);
    const newDriedStock = driedStock + wto;
    await ctx.stub.putState(
      driedstockKey,
      Buffer.from(newDriedStock.toString())
    );
    // add to processing stock
    await this.updateProcessing(ctx, wti);
  }

  // here -> weightIn is coffee sent for roast.
  // weightOut -> coffee received after roasting process.
  // this function basically updates raw stock on basis of roast coffee.
  async roast(ctx, weightIn, weightOut) {
    // let clientMSPID = await ctx.clientIdentity.getMSPID()
    // if (clientMSPID !== 'tataMSP') {
    //     throw new Error('Only Manufacturer can process the material');
    // }

    let wti = parseInt(weightIn);
    let wto = parseInt(weightOut);
    if (wti < wto) {
      throw new Error("Invalid weights");
    }
    let diff = wti - wto;
    await this.updateWastedStock(ctx, diff);

    // Fetch and update the dried stock
    let driedStock = await this.availableDriedStock(ctx);
    if (driedStock < wti) {
      throw new Error(
        "Dried Stock Is Less In Roasting, current = ",
        driedStock
      );
    }
    let newDriedStock = driedStock - wti;
    await ctx.stub.putState(
      driedstockKey,
      Buffer.from(newDriedStock.toString())
    );

    // Fetch and update the roasted stock
    await this.updateRoastedStock(ctx, wto, 0);
    // const roastedStock = this.availableRoastedStock(ctx);
    // const newRoastedStock = parseInt(roastedStock) + wto;
    // await ctx.stub.putState(roastedstockKey, Buffer.from(newRoastedStock.toString()));
  }

  // here -> weightIn is coffee sent for QA.
  // weightOut -> coffee received after QA process.
  // this function basically updates raw stock on basis of QA coffee.
  async doQA(ctx, weightIn, weightOut) {
    // let clientMSPID = await ctx.clientIdentity.getMSPID()
    // if (clientMSPID !== 'tataMSP') {
    //     throw new Error('Only Manufacturer can process the material');
    // }

    let wti = parseInt(weightIn);
    let wto = parseInt(weightOut);
    if (wti < wto) {
      throw new Error("Invalid weights");
    }
    let diff = wti - wto;
    await this.updateWastedStock(ctx, diff);

    // Fetch and update the roasted stock
    let roastedStock = await this.availableRoastedStock(ctx);
    if (parseInt(roastedStock) < wti) {
      throw new Error("Roasted Stock Is Less For QA, current");
    }
    await this.updateRoastedStock(ctx, wti, 1);

    // Fetch and update finished stock
    await this.updateFinishedStock(ctx, wto, 0);
    // let newFinishedStock = finishedStock + weightOut;
    // await ctx.stub.putState(finishedstockKey, Buffer.from(newFinishedStock.toString()));
  }

  // amtInKg -> the amount which needs to be packaged
  // this function packages the amount , updates the remaining coffee in finished stock.
  async package(ctx, amtInKg) {
    // let clientMSPID = await ctx.clientIdentity.getMSPID()
    // if (clientMSPID !== 'tataMSP') {
    //     throw new Error('Only Manufacturer can process the material');
    // }
    // check for current stock fulfills demand for packaging or not
    let amt = parseInt(amtInKg);
    let currentStock = await this.availableFinishedStock(ctx);
    if (currentStock < amt) {
      throw new Error(
        "Current Finished Stock is less than demand for packaging, current=",
        currentStock
      );
    }

    let noOfPackages = amt / packSize;
    // update finished Stock
    await this.updateFinishedStock(ctx, amt, 1);
    // update total packages
    await this.updateTotalPackages(ctx, noOfPackages, 0);
  }

  async dispatch(ctx, packages) {
    // let clientMSPID = await ctx.clientIdentity.getMSPID()
    // if (clientMSPID !== 'tataMSP') {
    //     throw new Error('Only Manufacturer can process the material');
    // }

    // check the available packages
    let currentPackages = await ctx.stub.getState(totalPackages);
    if (currentPackages < packages) {
      throw new Error(
        "Less Packages Are Available, current = ",
        currentPackages
      );
    }

    // update the wharehouse stock & number of packages
    await this.updateWhareHouseStock(ctx, packages);
    await this.updateTotalPackages(ctx, packages, 1);
  }

  async getTotalPackages(ctx) {
    let totalPackagesBytes = await ctx.stub.getState(totalPackages);
    let packs = parseInt(totalPackagesBytes.toString());
    return packs;
  }

  async updateTotalPackages(ctx, pck, flag) {
    if (flag == 0) {
      let pack = await this.getTotalPackages(ctx);
      pack = parseInt(pack);
      pck = parseInt(pck);
      pack += pck;
      await ctx.stub.putState(totalPackages, Buffer.from(pack.toString()));
    } else if (flag == 1) {
      let pack = await this.getTotalPackages(ctx);
      pack = parseInt(pack);
      pck = parseInt(pck);
      pack -= pck;
      await ctx.stub.putState(totalPackages, Buffer.from(pack.toString()));
    }
  }

  async getWharehouseStock(ctx) {
    let stockBytes = await ctx.stub.getState(whareHouseStock);
    let stock = parseInt(stockBytes.toString());
    return stock;
  }

  async updateWhareHouseStock(ctx, stk) {
    let stock = await this.getWharehouseStock(ctx);
    stock = parseInt(stock);
    stk = parseInt(stk);
    stock += stk;
    await ctx.stub.putState(whareHouseStock, Buffer.from(stock.toString()));
  }

  // async packageDetails(ctx, packNo) {
  //     let pdBytes = await ctx.stub.getState(packNo);
  //     let pd = JSON.parse(JSON.stringify(pdBytes));
  //     console.log('Hash of batch $s is %s', packNo, bd.Hash);
  //     return pd;
  // }

  // async packagesDispatched(ctx) {
  //     let total;
  //     try {
  //         total = await totalPackages(ctx);
  //     } catch (err) {
  //         throw err;
  //     }
  //     let totalDispatched;
  //     for (let i = 1 ; i <= total ; i++) {
  //         let pd
  //         try {
  //             pd = await this.packageDetails(ctx, i);
  //         } catch (err) {
  //             throw err;
  //         }
  //         if (pd.Status === status[1]) {
  //             totalDispatched++;
  //         }
  //     }
  //     console.log('Total number of processed batches are %s', totalDispatched);
  //     return totalDispatched;
  // }
}

module.exports = mwcc;
