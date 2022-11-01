/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const { Contract, Context } = require('fabric-contract-api');
const { hasher } = require('./hasher.js');
const stockKey = 'stock'
const nameKey = 'name'
const batchKey = 'batch'
const batchPrefix = 'orderNumber'
const batchSize = 30 //kg
const status = ['BATCH_CREATED', 'DRIED', 'ROASTED', 'QA_COMPLETE', 'PACKAGED', 'DISPATCHED'];

class mwcc extends Contract {

    async initialize(ctx, name) {
        await ctx.stub.putState(nameKey, Buffer.from('0'));
        console.log('Current stock is %s', currentStock);
        return currentStock;
    }

    async updateStock(ctx, amt) {
        const clientMSPID = await ctx.clientIdentity.getMSPID();
        if (clientMSPID !== 'ManufacturerMSP') {
            throw new Error('only Manufacturer can update stock');
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
        if (clientMSPID !== 'ManufacturerMSP') {
            throw new Error('only Manufacturer can check available stock')
        }
        const ASBytes = await ctx.stub.getState(stockKey);
        const AS = parseInt(ASBytes.toString())
        console.log("Available Stock is %s kg", AS);
        return AS;
    }

    async createBatch(ctx, amountInKg) {
        const noOfBatches = amountInKg / batchSize
        const totalBatchesBytes = await ctx.stub.getState(batchKey);
        let totalBatches;
        if (!totalBatchesBytes || totalBatchesBytes.length === 0) {
            totalBatches = noOfBatches;
        } else {
            totalBatches = parseInt(totalBatchesBytes.toString()) + noOfBatches;
        }
        for ( let i = 1 ; i <= noOfBatches ; i++) {
            let hash = await hasher.getHash(totalBatches + 1);
            const batchDetails = {
                "Hash": hash,
                "Status": status[0],
                "Weight": batchSize,
                "AmountRejected": 0,
                "Owner": "ManufacturerMSP"
            }
            const batchDetailsKey = await ctx.stub.createCompositeKey(batchPrefix, [totalBatches + i]);
            await ctx.stub.putState(batchDetailsKey, Buffer.from(JSON.stringify(batchDetails)));
            await ctx.stub.putState(batchKey, Buffer.from(JSON.stringify(totalBatches + 1)))
        }
    }

    async dry(ctx, batchNo) {
        const clientMSPID = await ctx.clientIdentity.getMSPID()
        if (clientMSPID !== 'ManufacturerMSP') {
            throw new Error('Only Manufacturer can process the material');
        }
        const batchDetailsKey = await ctx.stub.createCompositeKey(batchPrefix, [batchNo]);
        const bdBytes = await ctx.stub.getState(batchDetailsKey);
        const bd = parse(JSON.stringify(bdBytes));
        bd.Status = status[1];
        await ctx.stub.putState(batchDetailsKey, Buffer.from(JSON.stringify(bd)));
        console.log('Status of batch %s changed to %s', batchNo, bd.Status);
    }

    async roast(ctx, batchNo) {
        const clientMSPID = await ctx.clientIdentity.getMSPID()
        if (clientMSPID !== 'ManufacturerMSP') {
            throw new Error('Only Manufacturer can process the material');
        }
        const batchDetailsKey = await ctx.stub.createCompositeKey(batchPrefix, [batchNo]);
        const bdBytes = await ctx.stub.getState(batchDetailsKey);
        const bd = parse(JSON.stringify(bdBytes));
        bd.Status = status[2];
        await ctx.stub.putState(batchDetailsKey, Buffer.from(JSON.stringify(bd)));
        console.log('Status of batch %s changed to %s', batchNo, bd.Status);
    }

    async doQA(ctx, batchNo, batchWeight) {
        const clientMSPID = await ctx.clientIdentity.getMSPID()
        if (clientMSPID !== 'ManufacturerMSP') {
            throw new Error('Only Manufacturer can process the material');
        }
        const batchDetailsKey = await ctx.stub.createCompositeKey(batchPrefix, [batchNo]);
        const bdBytes = await ctx.stub.getState(batchDetailsKey);
        const bd = parse(JSON.stringify(bdBytes));
        bd.Status = status[3];
        bd.Weight = batchWeight
        bd.AmountRejected = batchSize - batchWeight;
        await ctx.stub.putState(batchDetailsKey, Buffer.from(JSON.stringify(bd)));
        console.log('Status of batch %s changed to %s', batchNo, bd.Status);
    }

    async package(ctx, batchNo) {
        const clientMSPID = await ctx.clientIdentity.getMSPID()
        if (clientMSPID !== 'ManufacturerMSP') {
            throw new Error('Only Manufacturer can process the material');
        }
        const batchDetailsKey = await ctx.stub.createCompositeKey(batchPrefix, [batchNo]);
        const bdBytes = await ctx.stub.getState(batchDetailsKey);
        const bd = parse(JSON.stringify(bdBytes));
        bd.Status = status[4];
        await ctx.stub.putState(batchDetailsKey, Buffer.from(JSON.stringify(bd)));
        console.log('Status of batch %s changed to %s', batchNo, bd.Status);
    }

    async dispatch(ctx, batchNo) {
        const clientMSPID = await ctx.clientIdentity.getMSPID()
        if (clientMSPID !== 'ManufacturerMSP') {
            throw new Error('Only Manufacturer can process the material');
        }
        const batchDetailsKey = await ctx.stub.createCompositeKey(batchPrefix, [batchNo]);
        const bdBytes = await ctx.stub.getState(batchDetailsKey);
        const bd = parse(JSON.stringify(bdBytes));
        bd.Status = status[5];
        bd.owner = 'WarehouseMSP';
        await ctx.stub.putState(batchDetailsKey, Buffer.from(JSON.stringify(bd)));
        console.log('Status of batch %s changed to %s', batchNo, bd.Status);
    }

    async totalBatches(ctx) {
        const totalBytes = await ctx.stub.getState(batchKey);
        const total = parseInt(totalBytes.toString());
        console.log('Total Number of Batches are %s', total);
        return total;
    }

    async batchDetails(ctx, batchNo) {
        const batchDetailsKey = await ctx.stub.createCompositeKey(batchPrefix, [batchNo]);
        const bdBytes = await ctx.stub.getState(batchDetailsKey);
        const bd = parse(JSON.stringify(bdBytes));
        console.log('Hash of batch $s is %s', batchNo, bd.Hash);
        return bd;
    }

    async batchesReadyForStorage(ctx) {
        const total = await totalBatches(ctx);
        let totalProcessed;
        for (let i = 1 ; i <= total ; i++) {
            const batchDetailsKey = await ctx.stub.createCompositeKey(batchPrefix, [batchNo]);
            const bdBytes = await ctx.stub.getState(batchDetailsKey);
            const bd = parse(JSON.stringify(bdBytes));
            if (bd.Status === status[4]) {
                totalProcessed++;
            }
        }
        console.log('Total number of processed batches are %s', totalProcessed);
        return totalProcessed;  
    }

    async batchesDispatched(ctx) {
        const total = await totalBatches(ctx);
        let totalDispatched;
        for (let i = 1 ; i <= total ; i++) {
            const batchDetailsKey = await ctx.stub.createCompositeKey(batchPrefix, [batchNo]);
            const bdBytes = await ctx.stub.getState(batchDetailsKey);
            const bd = parse(JSON.stringify(bdBytes));
            if (bd.Status === status[5]) {
                totalDispatched++;
            }
        }
        console.log('Total number of processed batches are %s', totalDispatched);
        return totalDispatched;  
    }

    }