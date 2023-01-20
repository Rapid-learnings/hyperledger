import { Injectable } from '@nestjs/common';
import { Gateway, Wallets } from 'fabric-network';
import { HelperService } from 'src/helper/helper.service';
@Injectable()
export class WrccService {
  constructor(private helperObj: HelperService) {}

  getWallet = async (org_name) => {
    console.log(org_name);
    let walletPath = await this.helperObj.getWalletPath(org_name);
    console.log(walletPath);
    let wallet = await Wallets.newFileSystemWallet(walletPath);
    // console.log(wallet);
    return wallet;
    // console.log(`Wallet path: ${walletPath}`);
  };

  evaluateTx = async (channelName, chaincodeName, fcn, username, org_name) => {
    try {
      const ccp = await this.helperObj.getCCP(org_name);

      const wallet = await this.getWallet(org_name);

      const connectOptions = this.helperObj.getConnectionObject(
        wallet,
        username,
      );

      console.log('Connection Object = ', connectOptions);

      const gateway = new Gateway();
      await gateway.connect(ccp, connectOptions);

      const network = await gateway.getNetwork('whs-rtlr-channel');
      // console.log("N/w = ",network);
      const contract = await network.getContract('wrcc');

      let result;
      let message;

      switch (fcn) {
        case 'returnWarehouseSTockAccordingTomwCC':
          result = await contract.evaluateTransaction(fcn);
          result = result.toString();
          break;
        case 'getRetailerBalance':
          result = await contract.evaluateTransaction(fcn);
          result = JSON.parse(result);
          console.log(result);
          break;
        case 'getRetailerStock':
          result = await contract.evaluateTransaction(fcn);
          result = JSON.parse(result);
          break;
        case 'getWareHouseBalance':
          result = await contract.evaluateTransaction(fcn);
          result = JSON.parse(result);
          break;
        case 'initialize':
          await contract.submitTransaction(fcn);
          break;
        // case "placeOrder":
        //   result = await contract.submitTransaction(fcn, )
        default:
          break;
      }

      await gateway.disconnect();

      // result = JSON.parse(result.toString());

      // let response = {
      //   message: message,
      //   result,
      // };

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
    org_name,
  ) => {
    try {
      const gateway = new Gateway();
      console.log(fcn, args, username, org_name);
      const ccp = await this.helperObj.getCCP(org_name);
      let wallet = await this.getWallet(org_name);
      const connectOptions = await this.helperObj.getConnectionObject(
        wallet,
        username,
      );
      await gateway.connect(ccp, connectOptions);
      let network = await gateway.getNetwork('whs-rtlr-channel');
      let contract = await network.getContract('wrcc');

      let result;

      console.log(args);
      let txId = await contract.submitTransaction(
        'placeOrder',
        args[0],
        args[1],
        args[2],
      );
      const listener = async (event) => {
        if (event.eventName === 'place-order') {
          const details = event.payload.toString('utf8');
          console.log('details = ', details);
          event = JSON.parse(details);
          console.log('event = ', event);
          // Run business process to handle orders
          result = event;
        }
      };
      await contract.addContractListener(listener);

      await gateway.disconnect();
      console.log('result', result);
      return { result: result, txId: txId };
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
    org_name,
  ) => {
    try {
      const gateway = new Gateway();
      //   console.log(fcn, args, username, org_name);
      const ccp = await this.helperObj.getCCP(org_name);
      let wallet = await this.getWallet(org_name);
      const connectOptions = await this.helperObj.getConnectionObject(
        wallet,
        username,
      );
      await gateway.connect(ccp, connectOptions);
      let network = await gateway.getNetwork('whs-rtlr-channel');
      let contract = await network.getContract('wrcc');

      let result;

      //   console.log(args);
      result = await contract.submitTransaction(
        'updateStatusToInTransit',
        orderNumber,
      );
      console.log(result);
      await gateway.disconnect();
      result = result.toString();
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
    org_name,
  ) => {
    try {
      const gateway = new Gateway();
      const ccp = await this.helperObj.getCCP(org_name);
      let wallet = await this.getWallet(org_name);
      const connectOptions = await this.helperObj.getConnectionObject(
        wallet,
        username,
      );
      await gateway.connect(ccp, connectOptions);
      let network = await gateway.getNetwork('whs-rtlr-channel');
      let contract = await network.getContract('wrcc');

      let result: any;
      result = await contract.submitTransaction(
        'updateStatusToDelivered',
        orderNumber,
      );
      console.log(result);
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
    org_name,
  ) => {
    try {
      const ccp = await this.helperObj.getCCP(org_name);
      const wallet = await this.getWallet(org_name);
      const connectionOptions = this.helperObj.getConnectionObject(
        wallet,
        username,
      );
      const gateway = new Gateway();
      await gateway.connect(ccp, connectionOptions);
      const network = await gateway.getNetwork(channelName);
      const chainCode = await network.getContract(chaincodeName);
      let result: any = await chainCode.submitTransaction(fcn, orderNumber);
      await gateway.disconnect();
      result = result.toString();
      console.log('Order Details = ', result);
      return result;
    } catch (err) {
      return err;
    }
  };
}
