const {Contract} = require('fabric-contract-api');

class AssetTransfer extends Contract{
    // this class provides tx context for 
    // fx defined within the smart contract

    async AssetTransfer(ctx, id, color, owner, value){
        const hondaAsset = {
            ID: id,
            Color:color,
            Size:size,
            Owner:owner,
            Value:value
        }
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    }
}