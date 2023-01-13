/*
SPDX-License-Identifier: Apache-2.0
*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pmcc = void 0;
// let { Contract, Context } = require("fabric-contract-api");
const fabric_contract_api_1 = require("fabric-contract-api");
let productionStock = "stock";
let orderNumber = "orderNumber";
let Status = [
    "order-placed",
    "in-transit",
    "delivered",
    "payout-claimed",
    "cancelled",
];
let manufacturerFunds = "MANUFACTURER_BALANCE";
let producerFunds = "PRODUCER_BALANCE";
let manufacturerOrderedStock = "MANUFACTURE_ORDERED_STOCK";
let pricePerKg = 100; // 100$ for 1 kg coffee
class pmcc extends fabric_contract_api_1.Contract {
    constructor() {
        super('pmcc');
    }
    // initializes the stock of the producer to a set amount and also initializes the erc20 token contract
    async init(ctx, initialStock) {
        await ctx.stub.putState(manufacturerFunds, Buffer.from("1000000"));
        console.log("Balance of tataMSP initialized to 1000000 $");
        console.log("Balance of teafarmMSP initialized to 1000000 $");
        await ctx.stub.putState(producerFunds, Buffer.from("1000000"));
        // console.log("Ordered Stock of Manufacturer is initialized to 0 $");
        // await ctx.stub.putState(producerFunds, Buffer.from("0"));
        await ctx.stub.putState(productionStock, Buffer.from(initialStock));
        console.log("Production Stock Initailized to " + initialStock);
        await ctx.stub.putState(manufacturerOrderedStock, Buffer.from('0'));
    }
    // this function updates the stock in production.
    async updateProductionStock(ctx, amtInKg, flag) {
        // Fetching current stock
        let currentStockBytes = await ctx.stub.getState(productionStock);
        let updatedStock = 0;
        let currentStock = parseInt(currentStockBytes.toString()); //get current stock in production
        if (flag == 0) {
            //flag == 0 is for deduction of stock in production
            updatedStock = currentStock - amtInKg;
        }
        else {
            //flag == 1 is for addition of stock in production
            // new stock added here
            updatedStock = currentStock + amtInKg;
        }
        await ctx.stub.putState(productionStock, Buffer.from(updatedStock.toString()));
        console.log("Stock is updated to %s", updatedStock);
        let stock = await ctx.stub.getState(productionStock);
        return parseInt(stock.toString());
    }
    // Queries available stock of the producer using the productionStock
    async availableStock(ctx) {
        let ASBytes = await ctx.stub.getState(productionStock);
        let availableStock = parseInt(ASBytes.toString());
        console.log("Available Stock is %s kg", availableStock);
        return availableStock;
    }
    async getManufacturerStock(ctx) {
        let stock = await ctx.stub.getState(manufacturerOrderedStock);
        let mfcStock = parseInt(stock.toString());
        return mfcStock;
    }
    async updateManufacturerStock(ctx, qty) {
        let stock = await ctx.stub.getState(manufacturerOrderedStock);
        let mfcStock = parseInt(stock.toString());
        let quantity = parseInt(qty.toString());
        mfcStock += quantity;
        await ctx.stub.putState(manufacturerOrderedStock, Buffer.from(mfcStock.toString()));
        console.log("Manufacturer Ordered Stock Updated to ", mfcStock);
    }
    async placeOrder(ctx, qty, cty, stateName) {
        // let clientMSPID = await ctx.clientIdentity.getMSPID();
        // if (clientMSPID !== 'tataMSP') {
        //     throw new Error('only manufacturer can place an order')
        // }
        // Updating the balances of the manufacturer
        let manufacturerBalance = await this.getManufacturerFunds(ctx);
        let prdBalance = await this.getProducerFunds(ctx);
        // Check for insufficient funds
        let amt = qty * pricePerKg; // calculate price to be paid
        if (manufacturerBalance < amt) {
            throw new Error("Manufacturer Has Insufficient Funds");
        }
        let prodStock = await this.availableStock(ctx);
        // check for sufficient stock
        if (prodStock < qty) {
            throw new Error("Sufficient Stock Is Not There");
        }
        // update stock
        try {
            let stock = await this.updateProductionStock(ctx, qty, 0);
        }
        catch (err) {
            throw err;
        }
        prdBalance += amt;
        manufacturerBalance -= amt;
        await this.updateManufacturerStock(ctx, qty);
        await ctx.stub.putState(manufacturerFunds, Buffer.from(manufacturerBalance.toString()));
        await ctx.stub.putState(producerFunds, Buffer.from(prdBalance.toString()));
        let orderStatus = Status[0];
        const order = {
            amount: amt.toString(),
            quantity: qty.toString(),
            orderStatus: orderStatus,
            country: cty,
            state: stateName,
        };
        // creating new order no.
        let orderNoBytes = await ctx.stub.getState(orderNumber);
        // console.log("OrderNoBytes = ", orderNoBytes);
        let orderNo = parseInt(orderNoBytes.toString());
        console.log("Order No = ", String(orderNo));
        if (!orderNoBytes || orderNoBytes.length === 0) {
            //  await ctx.stub.putState(orderNumber, Buffer.from('1'));
            orderNo = 1;
        }
        else {
            orderNo += 1;
            //  await ctx.stub.putState(orderNumber, Buffer.from(orderNo.toString()));
        }
        console.log(JSON.stringify(order).toString());
        // store the order details in the blockchain with the orderNo as key
        // orderNo = String(orderNo);
        let orderBuff = Buffer.from(JSON.stringify(order).toString());
        // console.log("Order Buffer = ", orderBuff);
        await ctx.stub.putState(orderNo.toString(), orderBuff);
        await ctx.stub.putState(orderNumber, Buffer.from(orderNo.toString()));
        await ctx.stub.setEvent("placeOrder", orderBuff);
        // fetching txID
        let txId = ctx.stub.getTxID();
        console.log("TX ID PMCC PLACE ORDER");
        console.log("###########################", txId);
        let result = {
            "orderNo": orderNo,
            "txId": txId,
        };
        return result;
        // return await this.getOrderDetails(ctx, orderNo);
    }
    // updates the status of the order to in-transit
    async updateStatusToInTransit(ctx, orderNo) {
        // let clientMSP = await ctx.clientIdentity.getMSPID();
        // if (clientMSP !== "teafarmMSP") {
        //   throw new Error("Only teafarm can upadte the status of shipment");
        // }
        // fetching order details
        let orderObj = await this.getOrderDetails(ctx, orderNo);
        let status = orderObj.orderStatus;
        if (status !== Status[0]) {
            throw new Error("cannot change status to in-transit as order is not even placed");
        }
        // updating the status
        orderObj.orderStatus = Status[1];
        //storing the new order details object with the orderNo key
        await ctx.stub.putState(orderNo, Buffer.from(JSON.stringify(orderObj)));
    }
    // updates the status of the order to delivered
    async updateStatusToDelivered(ctx, orderNo) {
        // let clientMSP = await ctx.clientIdentity.getMSPID();
        // if (clientMSP !== "teafarmMSP") {
        //   throw new Error("only Producer has permission to this update status");
        // }
        // fetching order details
        let orderObj = await this.getOrderDetails(ctx, orderNo);
        let status = orderObj.orderStatus;
        if (status !== Status[1]) {
            throw new Error("cannot change status to delivered as package is not even shipped");
        }
        // updating the status to delivered
        orderObj.orderStatus = Status[2];
        //storing the new order details object with the orderNo key
        await ctx.stub.putState(orderNo, Buffer.from(JSON.stringify(orderObj)));
    }
    // async claimPayout(ctx, orderNo) {
    //     let clientMSP = await ctx.clientIdentity.getMSPID()
    //     if (clientMSP !== 'teafarmMSP') {
    //         throw new Error('only Producer has permission to claim payout');
    //     }
    //     // fetching order details object with orderNo
    //     let orderObjBytes = await ctx.stub.getState(orderNo);
    //     let orderObj = parse(JSON.stringify(orderObjBytes));
    //     let status = orderObj.Status;
    //     let amt;
    //     // check whether status is 'delivered' else throws error
    //     if (status === Status[2]) {
    //         amt = orderObj.Amount;
    //         // transferring amount to producer
    //         let newBalance = balance + amt;
    //         await ctx.stub.putState(producerFunds, Buffer.from(newBalance.toString()));
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
    // Queries the order details object with orderNo as key
    async getOrderDetails(ctx, orderNo) {
        //fetching order details
        console.log("OrderNO IN DETAILS = ", orderNo);
        // let orderNo = String(oNo)
        let orderObjBytes = await ctx.stub.getState(orderNo);
        // console.log("---Order Bytes----\n", orderObjBytes);
        // console.log(JSON.parse(orderObjBytes));
        let orderObj = JSON.parse(orderObjBytes.toString());
        return orderObj;
    }
    // function to check account balances in $ of the user
    async getManufacturerFunds(ctx) {
        let balanceBytes = await ctx.stub.getState(manufacturerFunds);
        let balance = parseInt(balanceBytes.toString());
        console.log("Balance for %s is %s $", balance);
        return balance;
    }
    async getProducerFunds(ctx) {
        let balanceBytes = await ctx.stub.getState(producerFunds);
        let balance = parseInt(balanceBytes.toString());
        console.log("Balance for %s is %s $", balance);
        return balance;
    }
}
exports.pmcc = pmcc;
//# sourceMappingURL=pmcc.js.map