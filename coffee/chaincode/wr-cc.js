/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const { Contract, Context } = require('fabric-contract-api');
const { TokenERC20Contract } = require('./token-erc-20/chaincode-javascript/lib/tokenERC20.js')
const nameKey = 'name'
const stockKey = 'stock'
const Status = ['order-placed', 'in-transit', 'delivered', 'payout-claimed']
const orderDetailsPrefix = 'orderDetails';

class wrcc extends Contract {

    async initialize(ctx, name) {
        await ctx.stub.putState(nameKey, Buffer.from('0'));
        console.log('Current stock is %s', currentStock);
        return currentStock;
    }

    async updateStock(ctx, amt) {
        const clientMSPID = await ctx.clientIdentity.getMSPID();
        if (clientMSPID !== 'WarehouseMSP') {
            throw new Error('only Warehouse can update stock');
        }
        const stockBytes = await ctx.getState(stockKey);
        let stock
        if (!stockBytes || stockBytes.length === 0) {
            stock = amt;
        } else {
            stock = parseInt(stockBytes.toString()) + amt;
        }
        await ctx.stub.putState(stockKey, Buffer.from(stock.toString()));
        return stock;
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
        await TokenERC20Contract.transferFrom(ctx, clientMSPID, this.toString(), amt)
        const orderNoBytes = await ctx.stub.getState(orderKey);
        if (!orderNoBytes || orderNoBytes.length === 0) {
            orderNo = 1
        } else {
            orderNo = parseInt(orderNoBytes.toString());
            orderNo += 1;
        }
        await ctx.stub.putState(orderKey, Buffer.from(orderNo.toString()));
        this.updateStatusToOrderPlaced(ctx, orderNo);
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
        orderDetailsKey = await ctx.stub.createCompositeKey(orderDetailsPrefix, [orderNo])
        await ctx.stub.putState(orderDetailsKey, Buffer.from(JSON.stringify(order)));
    }
}