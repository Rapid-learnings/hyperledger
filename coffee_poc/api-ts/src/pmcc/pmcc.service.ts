import { Injectable } from '@nestjs/common';
import { Gateway, Wallets } from "fabric-network";
import { HelperService } from 'src/helper/helper.service';



@Injectable()
export class PmccService {
    constructor(private helperObj:HelperService){}

    getWallet = async (org_name) => {
        console.log(org_name);
        let walletPath = await this.helperObj.getWalletPath(org_name);
        console.log(walletPath);
        let wallet = await Wallets.newFileSystemWallet(walletPath);
        // console.log(wallet);
        return wallet;
        // console.log(`Wallet path: ${walletPath}`);
      };

    evaluateTx = async (
        channelName,
        chaincodeName,
        fcn,
        username,
        org_name
      ) => {
        try {
          const ccp = await this.helperObj.getCCP(org_name);
      
          const wallet = await this.getWallet(org_name);
      
          const connectOptions = this.helperObj.getConnectionObject(wallet, username);
      
          console.log("Connection Object = ", connectOptions);
      
          const gateway = new Gateway();
          await gateway.connect(ccp, connectOptions);
      
          const network = await gateway.getNetwork(channelName);
          // console.log("N/w = ",network);
          const contract = await network.getContract(chaincodeName);
          // console.log("Contract  = ", contract);
          // Important: Please dont set listener here, I just showed how to set it. If we are doing here, it will set on every invoke call.
          // Instead create separate function and call it once server started, it will keep listening.
          // await contract.addContractListener(contractListener);
          // await network.addBlockListener(blockListener);
      
          // Multiple smartcontract in one chaincode
          let result;
          let message;
      
          switch (fcn) {
            case "availableStock":
              result = await contract.evaluateTransaction(fcn);
              result = result.toString();
              break;
            case "getManufacturerStock":
              result = await contract.evaluateTransaction(fcn);
              result = JSON.parse(result);
              console.log(result);
              break;
            case "getManufacturerFunds":
              result = await contract.evaluateTransaction(fcn);
              result = JSON.parse(result);
              break;
            case "init":
              await contract.submitTransaction(fcn,"10000");
              break;
            // case "placeOrder":
            //   result = await contract.submitTransaction(fcn, )
            default:
              break;
          }
      
          await gateway.disconnect();
          return result;
        } catch (error) {
          console.log(`Getting error: ${error}`);
          return error.message;
        }
      };
      
      placeOrder = async (
        channelName,
        chaincodeName,
        fcn,
        args,
        username,
        org_name
      ) => {
        try {
          const gateway = new Gateway();
          console.log(fcn, args, username, org_name);
          const ccp = await this.helperObj.getCCP(org_name);
          let wallet = await this.getWallet(org_name);
          const connectOptions = await this.helperObj.getConnectionObject(wallet, username);
          await gateway.connect(ccp, connectOptions);
          let network = await gateway.getNetwork("mfd-prd-channel");
          let contract = await network.getContract("pmcc");
      
          let result;
      
          console.log(args[0], args[1]);
          result = await contract.submitTransaction(
            "placeOrder",
            args[0],
            args[1],
            args[2]
          );
          console.log(result);
          const listener = async (event) => {
            if (event.eventName === "placeOrder") {
              const details = event.payload.toString("utf8");
              event = JSON.parse(details);
              console.log(
                "************************ Start placeOrder Event **********************************"
              );
              console.log(`order number: ${JSON.parse(result.toString())}`);
              console.log(`amount: ${event.amount}`);
              console.log(`quantity: ${event.quantity}`);
              console.log(`status: ${event.orderStatus}`);
              console.log(`country: ${event.country}`);
              console.log(`state: ${event.state}`);
              console.log(
                "************************ End placeOrder Event ************************************"
              );
              // Run business process to handle orders
            }
          };
          await contract.addContractListener(listener);
      
          await gateway.disconnect();
          result = result.toString();
          return result;
        } catch (err) {
          return err;
        }
      };
      
      getOrderDetails = async (
        channelName,
        chaincodeName,
        fcn,
        orderNumber,
        username,
        org_name
      ) => {
        try {
          const ccp = await this.helperObj.getCCP(org_name);
          const wallet = await this.getWallet(org_name);
          const connectionOptions = this.helperObj.getConnectionObject(wallet, username);
          const gateway = new Gateway();
          await gateway.connect(ccp, connectionOptions);
          const network = await gateway.getNetwork(channelName);
          const chainCode = await network.getContract(chaincodeName);
          let result:any = await chainCode.submitTransaction(fcn, orderNumber);
          await gateway.disconnect();
          result = result.toString();
          console.log("Order Details = ",result);
          return result;
        } catch (err) {
          return err;
        }
      };
      
      orderInTransit = async (
        channelName,
        chaincodeName,
        fcn,
        orderNumber,
        username,
        org_name
      ) => {
        try {
          const ccp = await this.helperObj.getCCP(org_name);
          const wallet = await this.getWallet(org_name);
          // let identity = await wallet.get(username);
          // if (!identity) {
          //   //check if user is registered or not
          //   throw new Error(
          //     `The identity ${username} does not exist, register & try again`
          //   );
          // }
          const connectionOptions = this.helperObj.getConnectionObject(wallet, username);
          const gateway = new Gateway();
          await gateway.connect(ccp, connectionOptions);
          const network = await gateway.getNetwork(channelName);
          const chainCode = await network.getContract(chaincodeName);
          let result:any = await chainCode.submitTransaction(fcn, orderNumber);
          await gateway.disconnect();
          result = result.toString();
          console.log("Order Details = ",result);
          return result;
        } catch (err) {
          return err;
        }
      };
      
      orderDelivered = async (
        channelName,
        chaincodeName,
        fcn,
        orderNumber,
        username,
        org_name
      ) => {
        try {
          const ccp = await this.helperObj.getCCP(org_name);
          const wallet = await this.getWallet(org_name);
          // let identity = await wallet.get(username);
          // if (!identity) {
          //   //check if user is registered or not
          //   throw new Error(
          //     `The identity ${username} does not exist, register & try again`
          //   );
          // }
          const connectionOptions = this.helperObj.getConnectionObject(wallet, username);
          const gateway = new Gateway();
          await gateway.connect(ccp, connectionOptions);
          const network = await gateway.getNetwork(channelName);
          const chainCode = await network.getContract(chaincodeName);
          let result:any = await chainCode.submitTransaction(fcn, orderNumber);
          await gateway.disconnect();
          result = result.toString();
          console.log("Order Details = ",result);
          return result;
        } catch (err) {
          return err;
        }
      };
      
}
