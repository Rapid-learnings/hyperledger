/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const { Contract, Context } = require('fabric-contract-api');
const { TokenERC20Contract } = require('./token-erc-20/chaincode-javascript/lib/tokenERC20.js')
const nameKey = 'name'
const stockKey = 'stock'
const orderKey = 'orderNumber'
const orderDetailsPrefix = 'orderDetails'
const Status = ['order-placed', 'in-transit', 'delivered', 'payout-claimed']

// class MyContext extends Context {
//     constructor() {
//         super();
//     }

//     status(ctx, orderNo) {

//     }
// }

class pmcc extends Contract {

    async initialize(ctx, name) {
        const currentStockBytes = await ctx.stub.getState(stockKey);
        await TokenERC20Contract.initialize(ctx, "token", "TOK", 18);
        if (currentStockBytes || currentStockBytes.length > 0) {
            throw new Error('Contract already initialised');
        }
        console.log("====== Initializing Coffee Stock ======");
        await ctx.stub.putState(stockKey, Buffer.from('100'));
        await ctx.stub.putState(nameKey, Buffer.from(name.toString()));
        console.log("====== Initial Coffee Stock Set To 100 Kg ======");
        console.log("====== name is set to %s ======", name);
    }
    // amt - int
    async updateStock(ctx, amt) {
        const clientMSPID = await ctx.clientIdentity.getMSPID();
        if (clientMSPID !== 'ProducerMSP') {
            throw new Error('only producer can update stock')
        }
        const currentStockBytes = await ctx.stub.getState(stockKey);
        let updatedStock;
        if (!currentStockBytes || currentStockBytes.length === 0) {
            updatedStock = amt;
        } else {
            updatedStock = parseInt(currentStockBytes.toString()) + amt;
        }
        await ctx.stub.putState(stockKey, Buffer.from(updatedStock.toString()))
        console.log("Stock is updated to %s", updatedStock);
        return updatedStock;
    }

    async availableStock(ctx) {
        const clientMSPID = await ctx.clientIdentity.getMSPID();
        if (clientMSPID !== 'ProducerMSP') {
            throw new Error('only Producer can check available stock')
        }
        const ASBytes = await ctx.stub.getState(stockKey);
        const AS = parseInt(ASBytes.toString())
        console.log("Available Stock is %s kg", AS);
        return AS;
    }

    // loc - string
    // amt - int
    async placeOrder(ctx, qty, amt, country, state) {
        const clientMSPID = await ctx.clientIdentity.getMSPID();
        if (clientMSPID !== 'ManufacturerMSP') {
            throw new Error('only manufacturer can place an order')
        }
        await TokenERC20Contract.transferFrom(ctx, clientMSPID, this.toString(), amt)
        const orderNoBytes = await ctx.stub.getState(orderKey);
        orderNo = parseInt(orderNoBytes.toString());
        if (!orderNoBytes || orderNoBytes.length === 0) {
            await ctx.stub.putState(orderKey, Buffer.from('1'));
        } else {
            orderNo += 1;
            await ctx.stub.putState(orderKey, Buffer.from(orderNo.toString()));
        }
        this.updateStatusToOrderPlaced(ctx, orderNo);
        const time = ctx.stub.getDateTimestamp();
        let order = {
            "DeliveryLocation": {
                "Country": country,
                "State": state
            },
            "Time": time,
            "Amount": amt,
            "Quantity": qty  
        }
        orderDetailsKey = await ctx.stub.createCompositeKey(orderDetailsPrefix, [orderNo])
        await ctx.stub.putState(orderDetailsKey, Buffer.from(JSON.stringify(order)));
    }

    async updateStatusToOrderPlaced(ctx, orderNo) {
        const clientMSP = await ctx.clientIdentity.getMSPID()
        const statusBytes = await ctx.stub.getState(orderNo);
        if (statusBytes || statusBytes.length > 0) {
            throw new Error('invalid order');
        }
        if (clientMSP !== 'ProducerMSP') {
            throw new Error('only Producer has permission to update this status');
        }
        await ctx.stub.putState(orderNo, Buffer.from(Status[0]));
    }

    async updateStatusToInTransit(ctx, orderNo) {
        const clientMSP = await ctx.clientIdentity.getMSPID()
        const statusBytes = await ctx.stub.getState(orderNo);
        const status = statusBytes.toString()
        if (status !== Status[0]) {
            throw new Error('cannot change status to in-transit as order is not even placed');
        }
        if (clientMSP !== 'ProducerMSP') {
            throw new Error('only Producer has permission to update this status');
        }
        await ctx.stub.putState(orderNo, Buffer.from(Status[1]));
    }

    async updateStatusToDelivered(ctx, orderNo) {
        const clientMSP = await ctx.clientIdentity.getMSPID()
        const statusBytes = await ctx.stub.getState(orderNo);
        const status = statusBytes.toString()
        if (status !== Status[1]) {
            throw new Error('cannot change status to delivered as package is not even shipped');
        }
        if (clientMSP !== 'ManufacturerMSP') {
            throw new Error('only Producer has permission to this update status');
        }
        await ctx.stub.putState(orderNo, Buffer.from(Status[2]));
    }

    async claimPayout(ctx, orderNo) {
        const clientMSP = await ctx.clientIdentity.getMSPID()
        if (clientMSP !== 'ProducerMSP') {
            throw new Error('only Producer has permission to claim payout');
        }
        const statusBytes = await ctx.stub.getState(orderNo)
        const status = statusBytes.toString();
        let amt;
        if (status === Status[2]) {
            const orderDetailsKey = await ctx.stub.createCompositeKey(orderDetailsPrefix, [orderNo]);
            const orderObjBytes = await ctx.stub.getState(orderDetailsKey);
            const orderObj = parse(JSON.stringify(orderObjBytes));
            amt = orderObj.amount;
            await TokenERC20Contract.transferFrom(ctx, this.toString(), clientMSP, amt)
        } else {
            throw new Error('shipment must be delivered in order to collect payout');
        }
        await ctx.stub.putState(orderNo, Buffer.from(State[3]));
        return amt;
    }

    async getOrderDetails(ctx, orderNo) {
        const orderDetailsKey = await ctx.stub.createCompositeKey(orderDetailsPrefix, [orderNo]);
        const orderObjBytes = await ctx.stub.getState(orderDetailsKey);
        const orderObj = parse(JSON.stringify(orderObjBytes));
        const statusBytes = await ctx.stub.getState(orderNo);
        const status = statusBytes.toString()
        console.log("Order must be delivered to %s", orderObj.deliverylocation);
        console.log("Order amount is %s", orderObj.amount);
        console.log("Current status of order is %s", status);
        return orderObj && status;
    }
}

module.exports = pmcc;
