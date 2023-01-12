import { Injectable } from '@nestjs/common';
import path from 'path';
import { HelperService } from 'src/helper/helper.service';
const util = require('util');
const { Gateway, Wallets } = require('fabric-network');
const { BlockDecoder } = require('fabric-common');
const fs = require('fs');

@Injectable()
export class QsccService {
  constructor(private helperObj: HelperService) {}

  async qscc(channelName:string, chaincodeName:string, args:string, fcn:string, username:string, org_name:string) {
    console.log('====query.js====', org_name, username);
    try {
      const ccp = await this.helperObj.getCCP(org_name); //JSON.parse(ccpJSON);
      // Create a new file system based wallet for managing identities.
      const walletPath = await this.helperObj.getWalletPath(org_name); //.join(process.cwd(), 'wallet');
      const wallet = await Wallets.newFileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);

      // Check to see if we've already enrolled the user.
      let identity = await wallet.get(username);
      if (!identity) {
        console.log(
          `An identity for the user ${username} does not exist in the wallet, so registering user`,
        );
        return;
      }

      const gateway = new Gateway();
      await gateway.connect(ccp, {
        wallet,
        identity: username,
        discovery: { enabled: true, asLocalhost: true },
      });

      const network = await gateway.getNetwork(channelName);
      //   console.log("================network===============\n");

      // fixing chaincode name to qscc  which is for ledger and other Fabric-related queries
      const contract = network.getContract(chaincodeName);
      //   console.log("================Contract===============\n", contract);
      let result;

      if (fcn == 'GetBlockByNumber') {
        result = await contract.evaluateTransaction(fcn, channelName, args);
        // let pathLocation = path.join(process.cwd(),'/src/qscc/data/blockData.block');
        // // console.log("CWD = ", pathLocation);
        
        // fs.writeFileSync(pathLocation, result);
        // let runScript = () =>
        //   new Promise((resolve, reject) => {
        //     const { exec } = require('child_process');
        //     exec('sh block-decoder.sh', (error, stdout, stderr) => {
        //       console.log(stdout);
        //       console.log(stderr);
        //       if (error !== null) {
        //         console.log(`exec error: ${error}`);
        //         reject(false);
        //       } else {
        //         resolve(true);
        //       }
        //     });
        //   });

        // result = await runScript();
        // result = fs.readFileSync('./block.json');

        // result = JSON.parse(result.toString('utf-8'));
        result = BlockDecoder.decode(result);
      } else if (fcn == 'GetTransactionByID') {
        console.log('Enter');
        result = await contract.evaluateTransaction(fcn, channelName, args);
       
        // let pathLocation = path.join(process.cwd(),'/src/qscc/data/transactionData.block');
        // fs.writeFileSync(pathLocation, result);

        // let runScript = () =>
        //   new Promise((resolve, reject) => {
        //     const { exec } = require('child_process');
        //     exec('sh transaction-decoder.sh', (error, stdout, stderr) => {
        //       console.log(stdout);
        //       console.log(stderr);
        //       if (error !== null) {
        //         console.log(`exec error: ${error}`);
        //         reject(false);
        //       } else {
        //         resolve(true);
        //       }
        //     });
        //   });

        // result = await runScript();
        // result = fs.readFileSync('./transaction.json');
        // result = JSON.parse(result);

        result = BlockDecoder.decodeTransaction(result);
      }

      return result;
    } catch (error) {
      console.error(`Failed to evaluate transaction: ${error}`);
      return error.message;
    }
  }
}