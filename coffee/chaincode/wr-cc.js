/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const { Contract, Context } = require('fabric-contract-api');
// const { TokenERC20Contract } = require('./token-erc-20/chaincode-javascript/lib/tokenERC20.js')
const stockKey = 'stock'
const orderKey = 'orderNumber'
const Status = ['order-placed', 'in-transit', 'delivered', 'payout-claimed']
const retailerBalanceKey = 'RETAILER_BALANCE'
const warehouseBalanceKey = 'WAREHOUSE_BALANCE'

class wrcc extends Contract {

    async initialize(ctx) {
        console.log("====== Initializing Coffee Stock ======");
        await ctx.stub.putState(stockKey, Buffer.from('100'));
        console.log("====== Initial Coffee Stock Set To 100 packages ======");
        console.log('===== Initializisng balances =====')
        await ctx.putState(retailerBalanceKey, Buffer.from('1000'))
        await ctx.putState(warehouseBalanceKey, Buffer.from('0'))
        console.log('Initialized Balance of retailer to 1000 $');
        console.log('Initialized Balance of warehouse to 0 $');
    }

    async updateStock(ctx, amt, flag) {
        const clientMSPID = await ctx.clientIdentity.getMSPID();
        if (clientMSPID !== 'tatastoreMSP') {
            throw new Error('only Warehouse can update stock');
        }
        const stockBytes = await ctx.getState(stockKey);
        const stock = parseInt(stockBytes.toString())
        let updatedStock
        if (!stockBytes || stockBytes.length === 0) {
            updatedStock = amt;
        } 
        if (flag === 0 && amt > stock) {
            throw new Error('Current stock is lesser than amount to deduct')
        }
        if (flag === 0) {
            updatedStock = stock - amt;
        } else {
            updatedStock = stock + amt;
        }

        //Store the updated state in the blockchain
        await ctx.stub.putState(stockKey, Buffer.from(updatedStock.toString()));
        return updatedStock;
    }

    async availableStock(ctx) {
        const clientMSPID = await ctx.clientIdentity.getMSPID();
        if (clientMSPID !== 'WarehouseMSP') {
            throw new Error('only Warehouse can check available stock')
        }
        const ASBytes = await ctx.stub.getState(stockKey);
        const AS = parseInt(ASBytes.toString())
        console.log("Available Stock is %s kg", AS);
        return AS;
    }

    async placeOrder(ctx, qty, amt, country, state) {
        const clientMSPID = await ctx.clientIdentity.getMSPID();
        if (clientMSPID !== 'RetailerMSP') {
            throw new Error('only Retailer can check available stock')
        }
        // await TokenERC20Contract.transferFrom(ctx, clientMSPID, this.toString(), amt)

        let stock
        try {
            stock = await this.updateStock(ctx, qty, 0);
        } catch (err) { 
            throw err;
        }

        const orderNoBytes = await ctx.stub.getState(orderKey);
        let orderNo
        if (!orderNoBytes || orderNoBytes.length === 0) {
            orderNo = 1
        } else {
            orderNo = parseInt(orderNoBytes.toString());
            orderNo += 1;
        }
        await ctx.stub.putState(orderKey, Buffer.from(orderNo.toString()));
        const time = ctx.stub.getDateTimestamp();
        let order = {
            "DeliveryLocation": {
                "Country": country,
                "State": state
            },
            "Time": time,
            "Amount": amt,
            "Quantity": qty,
            "Status": Status[0]
        }

        // Updating the balances of the retailer
        let balance;
        try {
            balance = await this.getBalance(ctx);
        } catch(err) {
            throw err;
        }
        // Check for insufficient funds
        if (balance < amt) {
            throw new Error('Insufficient funds');
        }
        const newBalance = balance - amt;
        await ctx.stub.putState(retailerBalanceKey, Buffer.from(newBalance.toString()))
        
        // Store order details
        await ctx.stub.putState(orderNo, Buffer.from(JSON.stringify(order)));
    }

    async updateStatusToInTransit(ctx, orderNo) {
        const clientMSP = await ctx.clientIdentity.getMSPID()
        if (clientMSP !== 'tatastoreMSP') {
            throw new Error('Only teafarm can update the status of shipment');
        }

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
        const clientMSP = await ctx.clientIdentity.getMSPID()
        if (clientMSP !== 'bigbazarMSP') {
            throw new Error('only retailer has permission to this update status');
        }

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

    async claimPayout(ctx, orderNo) {
        const clientMSP = await ctx.clientIdentity.getMSPID()
        if (clientMSP !== 'tatastoreMSP') {
            throw new Error('only warehouse has permission to claim payout');
        }

        // fetching order details object with orderNo
        let orderObj;
        try {
            orderObj = await this.getOrderDetails(ctx, orderNo)
        } catch(err) {
            throw err;
        }
        const status = orderObj.Status;
        let amt;

        // check whether status is 'delivered' else throws error
        if (status === Status[2]) {
            amt = orderObj.Amount;
            // transferring amount to producer
            let balance;
            try {
                balance = await this.getBalance(ctx);
            } catch (err) {
                throw err;
            }
            const newBalance = balance + amt;
            await ctx.stub.putState(warehouseBalanceKey, Buffer.from(newBalance.toString()));
            // await TokenERC20Contract.transferFrom(ctx, this.toString(), clientMSP, amt)

            // updating the status of the order to payout-claimed
            orderObj.Status = Status[3];

            //storing the new order details object with the orderNo key
            await ctx.stub.putState(orderNo, Buffer.from(JSON.stringify(orderObj)));
            console.log('====== Payout of %s $ has been claimed ======', amt);
            return amt;
        } else {
            throw new Error('shipment must be delivered in order to collect payout');
        }
    }

    async getBalance(ctx) {
        const clientMSP = await ctx.clientIdentity.getMSPID();
        if (clientMSP === 'tatastoreMSP') {
            const balanceBytes = await ctx.stub.getState(warehouseBalanceKey);
            const balance = parseInt(balanceBytes.toString());
            console.log('Balance for %s is %s $', clientMSP, balance);
            return balance;
        } else {
            const balanceBytes = await ctx.stub.getState(retailerBalanceKey);
            const balance = parseInt(balanceBytes.toString());
            console.log('Balance for %s is %s $', clientMSP, balance);
            return balance;
        }
    }

    // Queries the order details object with orderNo as key
    async getOrderDetails(ctx, orderNo) {
        //fetching order details
        const orderObjBytes = await ctx.stub.getState(orderNo);
        const orderObj = parse(JSON.stringify(orderObjBytes));
        console.log("Order must be delivered to %s, %s", orderObj.DeliveryLocation.Country, orderObj.DeliveryLocation.State);
        console.log("Order amount is %s", orderObj.Amount);
        console.log("Order quantity is %s Kg", orderObj.Quantity);
        console.log("Current status of order is %s", Status);
        return orderObj;
    }

    async getCurrentOrderNumber(ctx) {
        const orderNoBytes = await ctx.stub.getState(orderKey);
        const orderNo = parseInt(orderNoBytes.toString())
        return orderNo;
    }
}

module.exports = wrcc;