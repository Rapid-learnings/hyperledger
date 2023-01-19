import { Injectable } from '@nestjs/common';
import { Gateway, Wallets } from 'fabric-network';
import { HelperService } from 'src/helper/helper.service';

@Injectable()
export class MwccService {
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
    const wallet = await this.getWallet(org_name);
    const gateway = new Gateway();
    try {
      const ccp = await this.helperObj.getCCP(org_name);

      let identity = await wallet.get(username);
      if (!identity) {
        console.log(
          `An identity for the user ${username} does not exist in the wallet, so register user before retry`,
        );
        return;
      }

      const connectOptions = this.helperObj.getConnectionObject(
        wallet,
        username,
      );

      console.log('Connection Object = ', connectOptions);

      console.log('connecting to gateway');

      await gateway.connect(ccp, connectOptions);

      console.log('connecting to network');

      const network = await gateway.getNetwork(channelName);

      console.log('connecting to contract');

      const contract = await network.getContract(chaincodeName);

      let result;
      // let message;

      switch (fcn) {
        case 'returnRawStockAccordingToPMCC':
          result = await contract.evaluateTransaction(fcn);
          result = result.toString();
          break;
        case 'availableDriedStock':
          result = await contract.evaluateTransaction(fcn);
          result = result.toString();
          break;
        case 'availableRoastedStock':
          result = await contract.evaluateTransaction(fcn);
          result = result.toString();
          break;
        case 'availableFinishedStock':
          result = await contract.evaluateTransaction(fcn);
          result = result.toString();
          break;
        case 'getTotalPackages':
          result = await contract.evaluateTransaction(fcn);
          result = result.toString();
          break;
        case 'getWastedStock':
          result = await contract.evaluateTransaction(fcn);
          result = result.toString();
          break;
        case 'initialize':
          await contract.submitTransaction(fcn);
          break;
        default:
          break;
      }
      return result;
    } catch (error) {
      console.log(`Getting error: ${error}`);
      return error.message;
    } finally {
      console.log('disconnecting gateway');
      gateway.disconnect();
    }
  };

  dry = async (channelName, chaincodeName, args, username, org_name) => {
    const wallet = await this.getWallet(org_name);
    const gateway = new Gateway();
    try {
      const ccp = await this.helperObj.getCCP(org_name);

      let identity = await wallet.get(username);
      if (!identity) {
        console.log(
          `An identity for the user ${username} does not exist in the wallet, so register user before retry`,
        );
        return;
      }

      const connectOptions = this.helperObj.getConnectionObject(
        wallet,
        username,
      );

      console.log('Connection Object = ', connectOptions);

      await gateway.connect(ccp, connectOptions);

      const network = await gateway.getNetwork(channelName);

      const contract = await network.getContract(chaincodeName);

      let res = await contract.submitTransaction('dry', args[0], args[1]);
      return res;
    } catch (err) {
      return err;
    } finally {
      console.log('disconnecting gateway');
      gateway.disconnect();
    }
  };

  roast = async (channelName, chaincodeName, args, username, org_name) => {
    const wallet = await this.getWallet(org_name);
    const gateway = new Gateway();
    try {
      const ccp = await this.helperObj.getCCP(org_name);

      let identity = await wallet.get(username);
      if (!identity) {
        console.log(
          `An identity for the user ${username} does not exist in the wallet, so register user before retry`,
        );
        return;
      }

      const connectOptions = this.helperObj.getConnectionObject(
        wallet,
        username,
      );

      console.log('Connection Object = ', connectOptions);

      await gateway.connect(ccp, connectOptions);

      const network = await gateway.getNetwork(channelName);

      const contract = await network.getContract(chaincodeName);

      let res = await contract.submitTransaction('roast', args[0], args[1]);
      return res;
    } catch (err) {
      return err;
    } finally {
      console.log('disconnecting gateway');
      gateway.disconnect();
    }
  };

  doQA = async (channelName, chaincodeName, args, username, org_name) => {
    const wallet = await this.getWallet(org_name);
    const gateway = new Gateway();
    try {
      const ccp = await this.helperObj.getCCP(org_name);

      let identity = await wallet.get(username);
      if (!identity) {
        console.log(
          `An identity for the user ${username} does not exist in the wallet, so register user before retry`,
        );
        return;
      }

      const connectOptions = this.helperObj.getConnectionObject(
        wallet,
        username,
      );

      console.log('Connection Object = ', connectOptions);

      await gateway.connect(ccp, connectOptions);

      const network = await gateway.getNetwork(channelName);

      const contract = await network.getContract(chaincodeName);

      let res = await contract.submitTransaction('doQA', args[0], args[1]);
      return res;
    } catch (err) {
      return err;
    } finally {
      console.log('disconnecting gateway');
      gateway.disconnect();
    }
  };

  package = async (channelName, chaincodeName, args, username, org_name) => {
    const wallet = await this.getWallet(org_name);
    const gateway = new Gateway();
    try {
      const ccp = await this.helperObj.getCCP(org_name);

      let identity = await wallet.get(username);
      if (!identity) {
        console.log(
          `An identity for the user ${username} does not exist in the wallet, so register user before retry`,
        );
        return;
      }

      const connectOptions = this.helperObj.getConnectionObject(
        wallet,
        username,
      );

      console.log('Connection Object = ', connectOptions);

      await gateway.connect(ccp, connectOptions);

      const network = await gateway.getNetwork(channelName);

      const contract = await network.getContract(chaincodeName);

      let res = await contract.submitTransaction('package', args[0]);
      return res;
    } catch (err) {
      return err;
    } finally {
      console.log('disconnecting gateway');
      gateway.disconnect();
    }
  };

  dispatch = async (channelName, chaincodeName, args, username, org_name) => {
    const wallet = await this.getWallet(org_name);
    const gateway = new Gateway();
    try {
      const ccp = await this.helperObj.getCCP(org_name);

      let identity = await wallet.get(username);
      if (!identity) {
        console.log(
          `An identity for the user ${username} does not exist in the wallet, so register user before retry`,
        );
        return;
      }

      const connectOptions = this.helperObj.getConnectionObject(
        wallet,
        username,
      );

      console.log('Connection Object = ', connectOptions);

      await gateway.connect(ccp, connectOptions);

      const network = await gateway.getNetwork(channelName);

      const contract = await network.getContract(chaincodeName);

      let res = await contract.submitTransaction('dispatch', args[0]);
      return res;
    } catch (err) {
      return err;
    } finally {
      console.log('disconnecting gateway');
      gateway.disconnect();
    }
  };
}
