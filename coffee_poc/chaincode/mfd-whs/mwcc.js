/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

let { Contract, Context, Info } = require('fabric-contract-api');
// let { hasher } = require('./hasher.js');
let rawstockKey = 'raw-stock'
let driedstockKey = 'dried-stock'
let roastedstockKey = 'roasted-stock'
let finishedstockKey = 'finished-stock'
let whareHouseStock = 'WHAREHOUSE_STOCK'
let packSize = 50 // Kg
let totalPackages = 'number-of-packages'
let status = ['READY_FOR_DISPATCH', 'DISPATCHED'];

class mwcc extends Contract {

    // intializes stock to a fixed amount
    async initialize(ctx) {
        console.log('===== Initializing all stocks =====');
        // await ctx.stub.putState(rawstockKey, Buffer.from('1000')); //link this to pmcc.js
        await ctx.stub.putState(driedstockKey, Buffer.from('0'));
        await ctx.stub.putState(roastedstockKey, Buffer.from('0'));
        await ctx.stub.putState(finishedstockKey, Buffer.from('0'));
        await ctx.stub.putState(totalPackages, Buffer.from('0'));
        await ctx.stub.putState(whareHouseStock, Buffer.from('0'));
        // await this.updateFromPmcc(ctx);
    }

    async updateFromPmcc(ctx){
        let result = await ctx.stub.invokeChaincode('pmcc', ['getManufacturerStock'], "mfd-prd-channel"); //ctx.stub.getChannelID() if cc on same channel
        let stock = result;
        console.info("Stock from pmcc = ",stock);
        await ctx.stub.putState(rawstockKey, Buffer.from(stock.toString())); //link this to pmcc.js
        return stock;
        // await ctx.stub.putState(rawstockKey, Buffer.from(stock.toString()));
    }

    async updateRawStock(ctx, amt, flag) {
        // let clientMSPID = await ctx.clientIdentity.getMSPID();
        // if (clientMSPID !== 'tataMSP') {
        //     throw new Error('only Manufacturer can update stock');
        // }
        let currentStock = await this.availableRawStock(ctx);
        currentStock = parseInt(currentStock)
        let stock
        // if (!stockBytes || stockBytes.length === 0) {
        //     currentStock = 0;
        // }
        if (flag == 1 && currentStock < amt) {
            throw new Error('Current stock is lesser than amount');
        }
        if (flag == 0) {
            // if flag is 0 then deduct
            stock = currentStock + amt;
        } else {
            // if flag is 1 then add stock
            stock = currentStock - amt
        }
        // Store the new state in the blockchain
        await ctx.stub.putState(rawstockKey, Buffer.from(stock.toString()));
        // return stock;
    }

    // Queries available stock
    async availableRawStock(ctx) {
        // let clientMSPID = await ctx.clientIdentity.getMSPID();
        // if (clientMSPID !== 'tataMSP') {
        //     throw new Error('only Manufacturer can check available stock')
        // }
        let ASBytes = await ctx.stub.getState(rawstockKey);
        let AS = (ASBytes.toString())
        console.log("Available RAW Stock is %s kg", String(AS));
        return String(AS);
    }

    async availableDriedStock(ctx) {
        // let clientMSPID = await ctx.clientIdentity.getMSPID();
        // if (clientMSPID !== 'tataMSP') {
        //     throw new Error('only Manufacturer can check available stock')
        // }
        let ASBytes = await ctx.stub.getState(driedstockKey);
        let AS = parseInt(ASBytes.toString())
        console.log("Available DRIED Stock is %s kg", AS);
        return parseInt(AS);
    }

    async availableRoastedStock(ctx) {
        // let clientMSPID = await ctx.clientIdentity.getMSPID();
        // if (clientMSPID !== 'tataMSP') {
        //     throw new Error('only Manufacturer can check available stock')
        // }
        let ASBytes = await ctx.stub.getState(roastedstockKey);
        let AS = parseInt(ASBytes.toString())
        console.log("Available ROASTED Stock is %s kg", AS);
        return parseInt(AS);
    }

    async availableFinishedStock(ctx) {
        let ASBytes = await ctx.stub.getState(finishedstockKey);
        let AS = parseInt(ASBytes.toString())
        console.log("Available FINISHED Stock is %s kg", AS);
        return parseInt(AS);
    }

    async updateFinishedStock(ctx, qty, flag){
        if(flag == 1){
            let finishedStock = await this.availableFinishedStock(ctx);
            finishedStock = parseInt(finishedStock)
            let newFinishedStock = finishedStock - qty;
            await ctx.stub.putState(finishedstockKey, Buffer.from(newFinishedStock.toString()));
        }else if(flag == 0){
            let finishedStock = await this.availableFinishedStock(ctx);
            finishedStock = parseInt(finishedStock)
            let newFinishedStock = finishedStock + qty;
            await ctx.stub.putState(finishedstockKey, Buffer.from(newFinishedStock.toString()));
        }
    }

    // here -> weightIn is coffee sent for drying.
    // weightOut -> coffee received after drying process.
    // this function basically updates raw stock on basis of dried coffee.
    async dry(ctx, weightIn, weightOut) {
        let clientMSPID = await ctx.clientIdentity.getMSPID()
        if (clientMSPID !== 'tataMSP') {
            throw new Error('Only Manufacturer can process the material');
        }
        //Check & Fetch and update the raw stock
        let rawStock = await this.availableRawStock(ctx);
        if(rawStock < weightIn){
            throw new Error("Stock is less in drying process, current = ", rawStock);
        }
        await this.updateRawStock(ctx, weightIn, 1);

        // Fetch and update the dried stock
        let driedStock = this.availableDriedStock(ctx);
        let newDriedStock = driedStock + parseInt(weightOut);
        await ctx.stub.putState(driedstockKey, Buffer.from(newDriedStock.toString()));
    }

    // here -> weightIn is coffee sent for roast.
    // weightOut -> coffee received after roasting process.
    // this function basically updates raw stock on basis of roast coffee.
    async roast(ctx, weightIn, weightOut) {
        let clientMSPID = await ctx.clientIdentity.getMSPID()
        if (clientMSPID !== 'tataMSP') {
            throw new Error('Only Manufacturer can process the material');
        }
        // Fetch and update the dried stock
        let driedStock = await this.availableDriedStock(ctx);
        if(driedStock < weightIn){
            throw new Error("Dried Stock Is Less In Roasting, current = ", driedStock);
        }
        driedStock = parseInt(driedStock);
        let newDriedStock = driedStock - parseInt(weightIn);
        await ctx.stub.putState(driedstockKey, Buffer.from(newDriedStock.toString()));

        // Fetch and update the roasted stock
        let roastedStock = this.availableRoastedStock(ctx);
        let newRoastedStock = roastedStock + parseInt(weightOut);
        await ctx.stub.putState(roastedstockKey, Buffer.from(newRoastedStock.toString()));
    }

        // here -> weightIn is coffee sent for QA.
    // weightOut -> coffee received after QA process.
    // this function basically updates raw stock on basis of QA coffee.
    async doQA(ctx, weightIn, weightOut) {
        let clientMSPID = await ctx.clientIdentity.getMSPID()
        if (clientMSPID !== 'tataMSP') {
            throw new Error('Only Manufacturer can process the material');
        }
        // Fetch and update the roasted stock
        let roastedStock = await this.availableRoastedStock(ctx);
        if(roastedStock < weightIn){
            throw new Error("Roasted Stock Is Less For QA, current")
        }
        roastedStock = parseInt(roastedStock);
        let newRoastedStock = roastedStock - weightIn;
        await ctx.stub.putState(roastedstockKey, Buffer.from(newRoastedStock.toString()));

        // Fetch and update finished stock
        await this.updateFinishedStock(ctx, weightOut,0);
        // let newFinishedStock = finishedStock + weightOut;
        // await ctx.stub.putState(finishedstockKey, Buffer.from(newFinishedStock.toString()));
    }

    // amtInKg -> the amount which needs to be packaged
    // this function packages the amount , updates the remaining coffee in finished stock.
    async package(ctx, amtInKg) {
        let clientMSPID = await ctx.clientIdentity.getMSPID()
        if (clientMSPID !== 'tataMSP') {
            throw new Error('Only Manufacturer can process the material');
        }
        // check for current stock fulfills demand for packaging or not
        let currentStock = this.availableFinishedStock(ctx);
        if(currentStock < amtInKg){
            throw new Error("Current Finished Stock is less than demand for packaging, current=", currentStock);
        }

        let noOfPackages = amtInKg / packSize;
        // update finished Stock
        await this.updateFinishedStock(ctx, amtInKg,1);

        await this.updateTotalPackages(ctx, noOfPackages, 0);
    }

    async dispatch(ctx, packages) {
        let clientMSPID = await ctx.clientIdentity.getMSPID()
        if (clientMSPID !== 'tataMSP') {
            throw new Error('Only Manufacturer can process the material');
        }
        
        // check the available packages
        let currentPackages = await ctx.stub.getState(totalPackages);
        if(currentPackages < packages){
            throw new Error("Less Packages Are Available, current = ", currentPackages);
        }

        // update the wharehouse stock & number of packages
        let whStock = await this.getWharehouseStock(ctx);
        whStock = parseInt(whStock);
        whStock += packages;
        await this.updateWhareHouseStock(ctx, whStock.toString());
        await this.updateTotalPackages(ctx, packages, 1);
    }

    async getTotalPackages(ctx) {
        let totalPackagesBytes = await ctx.stub.getState(totalPackages);
        let totalPackage = parseInt(totalPackagesBytes.toString());
        return parseInt(totalPackage);
    }

    async updateTotalPackages(ctx, pck, flag){
        if(flag == 0){
            let pack = await this.getTotalPackages(ctx);
            pack = parseInt(pack)
            pack += pck;
            await ctx.stub.putState(totalPackages, Buffer.from(pack.toString()));
        }else if(flag == 1){
            let pack = await this.getTotalPackages(ctx);
            pack = parseInt(pack)
            pack -= pck;
            await ctx.stub.putState(totalPackages, Buffer.from(pack.toString()));
        }
    }

    async getWharehouseStock(ctx){
        let stockBytes = await ctx.stub.getState(whareHouseStock);
        let stock = parseInt(stockBytes.toString());
        return parseInt(stock);
    }

    async updateWhareHouseStock(ctx, stk){
        let stock = await this.getWharehouseStock(ctx);
        stock = parseInt(stock);
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