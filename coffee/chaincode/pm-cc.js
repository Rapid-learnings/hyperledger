/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const { Contract } = require('fabric-contract-api');
const { ClientIdentity } = require('fabric-shim');
// const { TokenERC20Contract } = require('./token-erc-20/chaincode-javascript/lib/tokenERC20.js')
const producerStockKey = 'producer-stock'
const manufacturerStockKey = 'maufacturer-stock'
const orderKey = 'orderNumber'
const Status = ['order-placed', 'in-transit', 'delivered', 'payout-claimed']
const manufacturerBalanceKey = 'MANUFACTURER_BALANCE'
const producerBalanceKey = 'PRODUCER_BALANCE'

class pmcc extends Contract {

    // initializes the stock of the producer to a set amount
    async initialize(ctx) {
        const clientMSP = await ctx.clientIdentity.getMSPID();
        if (clientMSP !== 'teafarmMSP') {
            throw new Error('Only Producer can initialize the stock');
        }
        console.log("====== Initializing Coffee Stock ======");
        await ctx.stub.putState(producerStockKey, Buffer.from('100'));
        console.log("====== Initial Coffee Stock Set To 100 Kg ======");
    }

    // fucntion for initializing the balances for the manufacturer
    async initializeBalanceForManufacturer(ctx) {
        const clientMSP = await ctx.clientIdentity.getMSPID();
        if (clientMSP !== 'tataMSP') {
            throw new Error('Only Manufacturer can initialize Manufacturer balance');
        }
        // storing the balance of 1000000 $
        console.log('Balance of tataMSP initialized to 1000000 $');
        await ctx.stub.putState(manufacturerBalanceKey, Buffer.from('1000000'));
    }

    // fucntion for initializing the balances for the manufacturer
    async initializeBalanceForProducer(ctx) {
        const clientMSP = await ctx.clientIdentity.getMSPID();
        if (clientMSP !== 'teafarmMSP') {
            throw new Error('Only Producer can initialize Producer balance');
        }
        // storing the balance of 0 $ 
        console.log('Balance of teafarmMSP initialized to 0 $');
        await ctx.stub.putState(producerBalanceKey, Buffer.from('0'));
    }

    // this function updates the stock in production.
    async updateProducerStock(ctx, amtInKg, flag) {
        const clientMSPID = await ctx.clientIdentity.getMSPID();
        if (clientMSPID !== 'teafarmMSP') {
            throw new Error('only producer can update stock')
        }

        // Fetching current stock
        const currentStockBytes = await ctx.stub.getState(producerStockKey);
        let updatedStock;
        if (!currentStockBytes || currentStockBytes.length === 0) {
            updatedStock = amtInKg;
        }
        // Parse to int
        const amt = parseInt(amtInKg);
        let currentStock = parseInt(currentStockBytes.toString()) //get current stock in production
        
        if (flag == 0 && currentStock < amt) { //check for outstanding amt  
            throw new Error("Current Stock Is Less Than The Asked Amount");
        }
        
        if (flag == 0) { 
            //flag == 0 is for deduction of stock in production
            updatedStock = currentStock - amt;
        } else {
            //flag == 1 is for addition of stock in production
            // new stock added here
            updatedStock = currentStock + amt;
        }
        await ctx.stub.putState(producerStockKey, Buffer.from(updatedStock.toString()))
        console.log("Stock is updated to %s", updatedStock);
        return updatedStock;
    }

    // Queries available stock of the producer using the producerStockKey
    async availableStock(ctx) {
        const clientMSPID = await ctx.clientIdentity.getMSPID();
        if (clientMSPID === 'teafarmMSP') {
            const ASBytes = await ctx.stub.getState(producerStockKey);
            const AS = parseInt(ASBytes.toString())
            console.log("Available Stock of producer is %s kg", AS);
            return AS;
        } else {
            const ASBytes = await ctx.stub.getState(manufacturerStockKey);
            const AS = parseInt(ASBytes.toString())
            console.log("Available Stock of manufacturer is %s kg", AS);
            return AS;
        }
    }

    async placeOrder(ctx, qty, amt, country, state) {
        const clientMSPID = await ctx.clientIdentity.getMSPID();
        if (clientMSPID !== 'tataMSP') {
            throw new Error('only manufacturer can place an order')
        }

        // creating new order no.
        const orderNoBytes = await ctx.stub.getState(orderKey);
        let orderNo = parseInt(orderNoBytes.toString());
        if (!orderNoBytes || orderNoBytes.length === 0) {
            orderNo = 1;
            await ctx.stub.putState(orderKey, Buffer.from('1'));
        } else {
            orderNo += 1;
            await ctx.stub.putState(orderKey, Buffer.from(orderNo.toString()));
        }

        // creating an object which stores all order details
        const time = await ctx.stub.getDateTimestamp();
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

        // add approval
        // await TokenERC20Contract.Approve()
        // await TokenERC20Contract.TransferFrom(ctx, clientMSPID, this.toString(), amt)

        // Updating the balances of the manufacturer
        const balanceBytes = await ctx.stub.getState(manufacturerBalanceKey);
        const balance = parseInt(balanceBytes.toString());
        // Check for insufficient funds
        if (balance < amt) {
            throw new Error('Insufficient funds');
        }
        const newBalance = balance - amt;
        await ctx.stub.putState(manufacturerBalanceKey, Buffer.from(newBalance.toString()))
        // store the order details in the blockchain with the orderNo as key
        await ctx.stub.putState(orderNo, Buffer.from(JSON.stringify(order)));
        console.log('Order Number for you order is %s', orderNo);
        return orderNo;
    }

    // updates the status of the order to in-transit
    async updateStatusToInTransit(ctx, orderNo) {
        const clientMSP = await ctx.clientIdentity.getMSPID()
        if (clientMSP !== 'teafarmMSP') {
            throw new Error('Only teafarm can upadte the status of shipment');
        }

        // fetching order details
        const orderObjBytes = await ctx.stub.getState(orderNo);
        const orderObj = parse(JSON.stringify(orderObjBytes));
        const status = orderObj.Status;
        if (status !== Status[0]) {
            throw new Error('cannot change status to in-transit as order is not even placed');
        }

        // updating the status
        orderObj.Status = Status[1]
        //storing the new order details object with the orderNo key
        await ctx.stub.putState(orderNo, Buffer.from(JSON.stringify(orderObj)));

        // check for quantity in producer stock & update stock
        let qty = orderObj.Quantity;
        try {
            await this.updateProducerStock(ctx, qty, 0);
        } catch (err) { 
            throw err;
        }
    }

    // updates the status of the order to delivered and update the manufacturer stock
    async updateStatusToDelivered(ctx, orderNo) {
        const clientMSP = await ctx.clientIdentity.getMSPID()
        if (clientMSP !== 'tataMSP') {
            throw new Error('only Producer has permission to this update status');
        }

        // fetching order details
        const orderObjBytes = await ctx.stub.getState(orderNo);
        const orderObj = parse(JSON.stringify(orderObjBytes));
        const status = orderObj.Status;
        const qty = parseInt(orderObj.Quantity);
        if (status !== Status[1]) {
            throw new Error('cannot change status to delivered as package is not even shipped');
        }

        // updating the status to delivered
        orderObj.Status = Status[2]
        //storing the new order details object with the orderNo key
        await ctx.stub.putState(orderNo, Buffer.from(JSON.stringify(orderObj)));
        // Update manufacturer stock
        let manufacturerStock
        try {
            manufacturerStock = await this.availableStock(ctx);
        } catch(err) {
            throw err;
        }
        const newManufacturerStock = manufacturerStock + qty;
        await ctx.stub.putState(manufacturerStockKey, Buffer.from(newManufacturerStock.toString()));
    }

    async claimPayout(ctx, orderNo) {
        const clientMSP = await ctx.clientIdentity.getMSPID()
        if (clientMSP !== 'teafarmMSP') {
            throw new Error('only Producer has permission to claim payout');
        }

        // fetching order details object with orderNo
        const orderObjBytes = await ctx.stub.getState(orderNo);
        const orderObj = parse(JSON.stringify(orderObjBytes));
        const status = orderObj.Status;
        let amt;

        // check whether status is 'delivered' else throws error
        if (status === Status[2]) {
            amt = parseInt(orderObj.Amount);
            // transferring amount to producer
            let balance;
            try {
                balance = await this.getBalance(ctx);
            } catch (err) {
                throw err;
            }
            const newBalance = balance + amt;
            await ctx.stub.putState(producerBalanceKey, Buffer.from(newBalance.toString()));
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

    // function to check account balances in $ of the user
    async getBalance(ctx) {
        const clientMSP = await ctx.clientIdentity.getMSPID();
        if (clientMSP === 'teafarmMSP') {
            const balanceBytes = await ctx.stub.getState(producerBalanceKey);
            const balance = parseInt(balanceBytes.toString());
            console.log('Balance for %s is %s $', clientMSP, balance);
            return balance;
        } else {
            const balanceBytes = await ctx.stub.getState(manufacturerBalanceKey);
            const balance = parseInt(balanceBytes.toString());
            console.log('Balance for %s is %s $', clientMSP, balance);
            return balance;
        }
    }
}

module.exports = pmcc;
