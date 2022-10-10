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
    
    // ReadAsset returns the asset stored in the world state with given id.
    async ReadAsset(ctx, id) {
        const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return assetJSON.toString();
    }

}