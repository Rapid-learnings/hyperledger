/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const { Contract, Context } = require('fabric-contract-api');
const { hasher } = require('./hasher.js');
const rawstockKey = 'raw-stock'
const driedstockKey = 'dried-stock'
const roastedstockKey = 'roasted-stock'
const finishedstockKey = 'finished-stock'
const packSize = 50 // Kg
const packageKey = 'number-of-packages'
const status = ['READY_FOR_DISPATCH', 'DISPATCHED'];

class mwcc extends Contract {

    // intializes stock to a fixed amount
    async initialize(ctx) {
        console.log('===== Initializing all stocks =====');
        await ctx.stub.putState(rawstockKey, Buffer.from('1000'));
        await ctx.stub.putState(driedstockKey, Buffer.from('0'));
        await ctx.stub.putState(roastedstockKey, Buffer.from('0'));
        await ctx.stub.putState(finishedstockKey, Buffer.from('0'));
        console.log('===== Current raw stock is initialized to 1000 Kg =====');
    }

    async updateRawStock(ctx, amt, flag) {
        const clientMSPID = await ctx.clientIdentity.getMSPID();
        if (clientMSPID !== 'tataMSP') {
            throw new Error('only Manufacturer can update stock');
        }
        const stockBytes = await ctx.getState(rawstockKey);
        const currentStock = parseInt(stockBytes.toString())
        let stock
        if (!stockBytes || stockBytes.length === 0) {
            currentStock = 0;
        }
        if (flag === 0 && currentStock < amt) {
            throw new Error('Current stock is lesser than amount');
        }
        if (flag === 0) {
            // if flag is 0 then deduct
            stock = currentStock - amt;
        } else {
            // if flag is 1 then add stock
            stock = currentStock + amt
        }
        // Store the new state in the blockchain
        await ctx.stub.putState(rawstockKey, Buffer.from(stock.toString()));
        return stock;
    }

    // Queries available stock
    async availableRawStock(ctx) {
        const clientMSPID = await ctx.clientIdentity.getMSPID();
        if (clientMSPID !== 'tataMSP') {
            throw new Error('only Manufacturer can check available stock')
        }
        const ASBytes = await ctx.stub.getState(rawstockKey);
        const AS = parseInt(ASBytes.toString())
        console.log("Available Stock is %s kg", AS);
        return AS;
    }

    async availableDriedStock(ctx) {
        const clientMSPID = await ctx.clientIdentity.getMSPID();
        if (clientMSPID !== 'tataMSP') {
            throw new Error('only Manufacturer can check available stock')
        }
        const ASBytes = await ctx.stub.getState(driedstockKey);
        const AS = parseInt(ASBytes.toString())
        console.log("Available Stock is %s kg", AS);
        return AS;
    }

    async availableRoastedStock(ctx) {
        const clientMSPID = await ctx.clientIdentity.getMSPID();
        if (clientMSPID !== 'tataMSP') {
            throw new Error('only Manufacturer can check available stock')
        }
        const ASBytes = await ctx.stub.getState(roastedstockKey);
        const AS = parseInt(ASBytes.toString())
        console.log("Available Stock is %s kg", AS);
        return AS;
    }

    async availableFinishedStock(ctx) {
        const clientMSPID = await ctx.clientIdentity.getMSPID();
        if (clientMSPID !== 'tataMSP') {
            throw new Error('only Manufacturer can check available stock')
        }
        const ASBytes = await ctx.stub.getState(finishedstockKey);
        const AS = parseInt(ASBytes.toString())
        console.log("Available Stock is %s kg", AS);
        return AS;
    }

    async dry(ctx, weightIn, weightOut) {
        const clientMSPID = await ctx.clientIdentity.getMSPID()
        if (clientMSPID !== 'tataMSP') {
            throw new Error('Only Manufacturer can process the material');
        }
        // Fetch and update the raw stock
        let rawStock
        try {
            rawStock = await this.availableRawStock(ctx);
        } catch (err) {
            throw err;
        }
        const newRawStock = rawStock - weightIn
        await ctx.stub.putState(rawstockKey, Buffer.from(newRawStock.toString()));

        // Fetch and update the dried stock
        const driedStock = this.availableDriedStock(ctx);
        const newDriedStock = driedStock + weightOut;
        await ctx.stub.putState(driedstockKey, Buffer.from(newDriedStock.toString()));
    }

    async roast(ctx, weightIn, weightOut) {
        const clientMSPID = await ctx.clientIdentity.getMSPID()
        if (clientMSPID !== 'tataMSP') {
            throw new Error('Only Manufacturer can process the material');
        }
        // Fetch and update the dried stock
        let driedStock
        try {
            driedStock = await this.availableDriedStock(ctx);
        } catch (err) {
            throw err;
        }
        const newDriedStock = driedStock - weightIn;
        await ctx.stub.putState(driedstockKey, Buffer.from(newDriedStock.toString()));

        // Fetch and update the roasted stock
        const roastedStock = this.availableRoastedStock(ctx);
        const newRoastedStock = roastedStock + weightOut;
        await ctx.stub.putState(roastedstockKey, Buffer.from(newRoastedStock.toString()));
    }

    async doQA(ctx, weightIn, weightOut) {
        const clientMSPID = await ctx.clientIdentity.getMSPID()
        if (clientMSPID !== 'tataMSP') {
            throw new Error('Only Manufacturer can process the material');
        }
        // Fetch and update the roasted stock
        let roastedStock
        try {
            roastedStock = await this.availableRoastedStock(ctx);
        } catch (err) {
            throw err;
        }
        const newRoastedStock = roastedStock - weightIn;
        await ctx.stub.putState(roastedstockKey, Buffer.from(newRoastedStock.toString()));

        // Fetch and update finished stock
        let finishedStock
        try {
            finishedStock = this.availableFinishedStock(ctx);
        } catch (err) {
            throw err;
        }
        const newFinishedStock = finishedStock + weightOut;
        await ctx.stub.putState(finishedstockKey, Buffer.from(newFinishedStock.toString()));
    }

    async package(ctx, amtInKg) {
        const clientMSPID = await ctx.clientIdentity.getMSPID()
        if (clientMSPID !== 'tataMSP') {
            throw new Error('Only Manufacturer can process the material');
        }
        const noOfPackages = amtInKg / packSize;
        // update finished Stock
        const finishedStock = await this.availableFinishedStock(ctx);
        const newFinishedStock = finishedStock - amtInKg;
        await ctx.stub.putState(finishedstockKey, Buffer.from(newFinishedStock.toString()));
        
        const totalPackagesBytes = await ctx.stub.getState(packageKey);
        let totalPackages
        if (!totalPackagesBytes || totalPackagesBytes.length === 0) {
            totalPackages = 0;
        }

        for (let i = 1 ; i <= noOfPackages ; i++) {
            let hash = await hasher.getHash(totalPackages + i);
            const packageDetails = {
                "Package-Number": totalPackages + i,
                "Hash": hash,
                "Weight": packSize,
                "Owner": "tataMSP",
                "Status": status[0]
            }
            // Storing the package details object in the blockchain with its paclage number as key
            await ctx.stub.putState(totalPackages + i, Buffer.from(JSON.stringify(packageDetails)));
        }
        totalPackages += noOfPackages;
        await ctx.stub.putState(packageKey, Buffer.from(totalPackages.toString()));
    }

    async dispatch(ctx, packNo) {
        const clientMSPID = await ctx.clientIdentity.getMSPID()
        if (clientMSPID !== 'tataMSP') {
            throw new Error('Only Manufacturer can process the material');
        }
        let pd;
        try {
            pd = await this.packageDetails(ctx,packNo);
        } catch (err) {
            throw err;
        }
        pd.Status = status[1];
        pd.Owner = 'tatastoreMSP';
        await ctx.stub.putState(packNo, Buffer.from(JSON.stringify(pd)));
        console.log('Status of batch %s changed to %s', packNo, pd.Status);
    }

    async totalPackages(ctx) {
        const totalPackagesBytes = await ctx.stub.getState(packageKey);
        const totalPackages = parseInt(totalPackagesBytes.toString());
        return totalPackages;
    }

    async packageDetails(ctx, packNo) {
        const pdBytes = await ctx.stub.getState(packNo);
        const pd = parse(JSON.stringify(pdBytes));
        console.log('Hash of batch $s is %s', packNo, bd.Hash);
        return pd;
    }

    async packagesDispatched(ctx) {
        let total;
        try {
            total = await totalPackages(ctx);
        } catch (err) {
            throw err;
        }
        let totalDispatched;
        for (let i = 1 ; i <= total ; i++) {
            let pd
            try {
                pd = await this.packageDetails(ctx, i);
            } catch (err) {
                throw err;
            }
            if (pd.Status === status[1]) {
                totalDispatched++;
            }
        }
        console.log('Total number of processed batches are %s', totalDispatched);
        return totalDispatched;  
    }
}

module.exports = mwcc;