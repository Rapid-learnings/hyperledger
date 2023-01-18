/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const { Contract } = require('fabric-contract-api');
// const { TokenERC20Contract } = require('./token-erc-20/chaincode-javascript/lib/tokenERC20.js')
const wHStock = 'WHARE_HOUSE_STOCK'
const orderNumber = 'orderNumber'
const Status = ['order-placed', 'in-transit', 'delivered', 'payout-claimed']
const retailerBalance = 'RETAILER_BALANCE'
const warehouseBalance = 'WAREHOUSE_BALANCE'
const retailerStock = 'RETAILER_STOCK'
const pricePerPackage = 150
let rawStock;

class wrcc extends Contract {

    async initialize(ctx) {
        await ctx.stub.putState(retailerBalance, Buffer.from('100000'));
        await ctx.stub.putState(warehouseBalance, Buffer.from('100000'));
        //! connect wharehouse i.e wHstock stock from mwcc.js
        await ctx.stub.putState(retailerStock, Buffer.from('0'));
    }

    async returnWarehouseSTockAccordingTomwCC(ctx) {
        const rstock = await this.getRetailerStock(ctx)
        // Query the Manufacturers stock from pmcc
        const response = await ctx.stub.invokeChaincode('mwcc', ['getWharehouseStock'], 'mfd-whs-channel');
        // Extract value from the response object
        const currentManufacturerStockInPMCC = response.payload.toString();
        // return currentManufacturerStockInPMCC;
        let stock = parseInt(currentManufacturerStockInPMCC);
        rawStock = stock - rstock;
        return rawStock;
    }

    async updateWarehouseStock(ctx, qty, flag) {
        // const clientMSPID = await ctx.clientIdentity.getMSPID();
        // if (clientMSPID !== 'tatastoreMSP') {
        //     throw new Error('only Warehouse can update stock');
        // }
        const q = parseInt(qty)
        const stockBytes = await ctx.stub.getState(wHStock);
        const stock = parseInt(stockBytes.toString())
        let updatedStock;
        // if (!stockBytes || stockBytes.length === 0) {
        //     updatedStock = qty;
        // } 
        if (flag == 0 && q > stock) {
            throw new Error('Current stock is lesser than amount to deduct')
        }
        if (flag == 0) {
            updatedStock = stock - q;
        } else if(flag == 1) {
            updatedStock = stock + q;
        }

        //Store the updated state in the blockchain
        await ctx.stub.putState(wHStock, Buffer.from(updatedStock.toString()));
        return updatedStock;
    }

    async availableWarehouseStock(ctx) {
        // const ASBytes = await ctx.stub.getState(wHStock);
        // const AS = parseInt(ASBytes.toString())
        // console.log("Available Stock is %s kg", AS);
        // return parseInt(AS);
        let ASBytes = await ctx.stub.getState(wHStock);
        let AS = parseInt(ASBytes.toString())
        console.log("Available Stock is %s kg", AS);
        return AS;
    }

    async getRetailerBalance(ctx){
        let balBytes = await ctx.stub.getState(retailerBalance);
        let bal = parseInt(balBytes.toString());
        return bal;
    }

    async updateRetailerBalance(ctx, amt, flag){
        let bal = 0;
        bal = await this.getRetailerBalance(ctx);
        bal = parseInt(bal);
        if(flag == 0){
            bal += amt;
        }else if(flag == 1){
            bal -= amt;
        }
        await ctx.stub.putState(retailerBalance, Buffer.from(bal.toString()));
        return bal;
    }

    async getRetailerStock(ctx){
        let stockBytes = await ctx.stub.getState(retailerStock);
        let stock = parseInt(stockBytes.toString());
        return stock;
    }

    async updateRetailerStock(ctx, qty, flag){
        let stock = await ctx.stub.getState(retailerStock);
        if(flag == 0){
            let newStock = stock + qty;
            await ctx.stub.putState(retailerStock, Buffer.from(newStock.toString()));
        }else if(flag == 1){
            let newStk = stock - qty;
            await ctx.stub.putState(retailerStock, Buffer.from(newStk.toString()));
        }
    }

    async placeOrder(ctx, qty, country, state) {
        // const clientMSPID = await ctx.clientIdentity.getMSPID();
        // if (clientMSPID !== 'RetailerMSP') {
        //     throw new Error('only Retailer can check available stock')
        // }
        // await TokenERC20Contract.transferFrom(ctx, clientMSPID, this.toString(), amt)
        // let availableWHStock = await this.availableWarehouseStock(ctx);
        if(rawStock < parseInt(qty)){
            throw new Error("Wharehouse Stock Is Less Than The Asked Qty,  current = ", availableWHStock);
        }
        
        let currentRetailerFunds = await this.getRetailerBalance(ctx);
        let amt = parseInt(qty) * pricePerPackage;
        if(amt > currentRetailerFunds){
            throw new Error("Retailer Funds Are Insufficient, current = ", currentRetailerFunds);
        }

        await this.updateRetailerBalance(ctx, amt, 1);
        await this.updateWarehouseBalance(ctx, amt, 0);
        // await this.updateWarehouseStock(ctx, qty, 1);
        await this.updateRetailerStock(ctx, qty, 0);

        const orderNoBytes = await ctx.stub.getState(orderNumber);
        let orderNo
        if (!orderNoBytes || orderNoBytes.length === 0) {
            orderNo = 1
        } else {
            orderNo = parseInt(orderNoBytes.toString());
            orderNo += 1;
        }
        await ctx.stub.putState(orderNumber, Buffer.from(orderNo.toString()));
        // const time = ctx.stub.getDateTimestamp();
        let order = {
            "DeliveryLocation": {
                "Country": country,
                "State": state
            },
            "Amount": amt,
            "Quantity": qty,
            "Status": Status[0],
            "orderNumber":orderNo
        }
        // Store order details
        await ctx.stub.putState(orderNo.toString(), Buffer.from(JSON.stringify(order).toString('base64')));
        await ctx.stub.setEvent("place-order", Buffer.from(JSON.stringify(order).toString('base64')));
    }

    async updateStatusToInTransit(ctx, orderNo) {
        // const clientMSP = await ctx.clientIdentity.getMSPID()
        // if (clientMSP !== 'tatastoreMSP') {
        //     throw new Error('Only teafarm can update the status of shipment');
        // }

        // fetching order details
        let orderObj;
        try {
            orderObj = await this.getOrderDetails(ctx, orderNo)
        } catch(err) {
            throw err;
        }
        const status = orderObj.Status;
        if (status !== Status[0]) {
            throw new Error('cannot change status to in-transit as order is not even placed');
        }

        // updating the status
        orderObj.Status = Status[1]
        //storing the new order details object with the orderNo key
        await ctx.stub.putState(orderNo, Buffer.from(JSON.stringify(orderObj)));
    }

    // updates the status of the order to delivered
    async updateStatusToDelivered(ctx, orderNo) {
        // const clientMSP = await ctx.clientIdentity.getMSPID()
        // if (clientMSP !== 'bigbazarMSP') {
        //     throw new Error('only retailer has permission to this update status');
        // }

        // fetching order details
        let orderObj;
        try {
            orderObj = await this.getOrderDetails(ctx, orderNo)
        } catch(err) {
            throw err;
        }
        const status = orderObj.Status;
        if (status !== Status[1]) {
            throw new Error('cannot change status to delivered as package is not even shipped');
        }

        // updating the status to delivered
        orderObj.Status = Status[2]
        //storing the new order details object with the orderNo key
        await ctx.stub.putState(orderNo, Buffer.from(JSON.stringify(orderObj)));
    }

    // async claimPayout(ctx, orderNo) {
    //     const clientMSP = await ctx.clientIdentity.getMSPID()
    //     if (clientMSP !== 'tatastoreMSP') {
    //         throw new Error('only warehouse has permission to claim payout');
    //     }

    //     // fetching order details object with orderNo
    //     let orderObj;
    //     try {
    //         orderObj = await this.getOrderDetails(ctx, orderNo)
    //     } catch(err) {
    //         throw err;
    //     }
    //     const status = orderObj.Status;
    //     let amt;

    //     // check whether status is 'delivered' else throws error
    //     if (status === Status[2]) {
    //         amt = orderObj.Amount;
    //         // transferring amount to producer
    //         let balance;
    //         try {
    //             balance = await this.getWareHouseBalance(ctx);
    //         } catch (err) {
    //             throw err;
    //         }
    //         const newBalance = balance + amt;
    //         await ctx.stub.putState(warehouseBalance, Buffer.from(newBalance.toString()));
    //         // await TokenERC20Contract.transferFrom(ctx, this.toString(), clientMSP, amt)

    //         // updating the status of the order to payout-claimed
    //         orderObj.Status = Status[3];

    //         //storing the new order details object with the orderNo key
    //         await ctx.stub.putState(orderNo, Buffer.from(JSON.stringify(orderObj)));
    //         console.log('====== Payout of %s $ has been claimed ======', amt);
    //         return amt;
    //     } else {
    //         throw new Error('shipment must be delivered in order to collect payout');
    //     }
    // }

    async getWareHouseBalance(ctx) {
        const clientMSP = await ctx.clientIdentity.getMSPID();
        if (clientMSP === 'tatastoreMSP') {
            const balanceBytes = await ctx.stub.getState(warehouseBalance);
            const balance = parseInt(balanceBytes.toString());
            console.log('Balance for %s is %s $', clientMSP, balance);
            return balance;
        } else {
            const balanceBytes = await ctx.stub.getState(retailerBalance);
            const balance = parseInt(balanceBytes.toString());
            console.log('Balance for %s is %s $', clientMSP, balance);
            return balance;
        }
    }

    async updateWarehouseBalance(ctx, amt, flag){
        let bal = await this.getWareHouseBalance(ctx);
        if(flag == 0){
           let newBal = bal + amt;
           await ctx.stub.putState(warehouseBalance, Buffer.from(newBal.toString()))
        }else if(flag == 1){
            let nBal = bal - amt;
            await ctx.stub.putState(warehouseBalance, Buffer.from(nBal.toString()));
        }
    }

    // Queries the order details object with orderNo as key
    async getOrderDetails(ctx, orderNo) {
        //fetching order details
        const orderObjBytes = await ctx.stub.getState(orderNo);
        const orderObj = JSON.parse(orderObjBytes.toString());
        return orderObj;
    }

    async getCurrentOrderNumber(ctx) {
        const orderNoBytes = await ctx.stub.getState(orderNumber);
        const orderNo = parseInt(orderNoBytes.toString())
        return orderNo;
    }
}

module.exports = wrcc;