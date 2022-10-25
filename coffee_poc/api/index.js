// index.js
'use strict';
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express();
app.use(bodyParser);
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());

const manufactuererProducer = require('../chaincode/mfcPrd.js')
// module.exports.contracts = [manufactuererProducer];

app.post('/register', async(req,res,next)=>{
    let usrname = req.body.username;
    console.log("Name = ",usrname);
    let orgName = req.body.orgName;
    let response = await helper.getRegisteredUser(usrname, orgName, true);
    res.json(response);
})


app.get('/getStorage', async(req,res,next)=>{
    await manufactuererProducer.setInitialStorageForProducer();
    let storage = await manufactuererProducer.getStorageFromProducer();
    return res.json({message:"Storage is "+storage})
});


app.listen(1080,()=>{
    console.log("======== Server Listening At 1080 =======");
});