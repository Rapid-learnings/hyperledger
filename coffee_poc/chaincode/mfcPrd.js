var { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const FabricCAServices = require('fabric-ca-client');

const mfcPrd={}
let coffeeStorage
let orderDetails=[]


mfcPrd.setInitialStorageForProducer = async() =>{
    coffeeStorage = 1000
    console.log("====== Initial Coffee Storage Set To 1000 Kg ======");
}

mfcPrd.getStorageFromProducer = async() => {
    return coffeeStorage
}

// placing order from manufactuerer to producer.
mfcPrd.placeOrder = async(address, cAmt) => {
    // 1. check availability of stock
    if(coffeeStorage <= 0){
        return null;
    }
    // else
    // Params => address, consignment amt, orderStatus
        let orderObj = {
            orderID: "",
            address:address,
            consignmentAmount: parseInt(cAmt),
            orderStatus: "confirmation"
        }
        orderDetails.push(orderObj)
    return orderObj;
}

module.exports = mfcPrd;