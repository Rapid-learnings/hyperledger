"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MwccService = void 0;
const common_1 = require("@nestjs/common");
const fabric_network_1 = require("fabric-network");
const helper_service_1 = require("../helper/helper.service");
let MwccService = class MwccService {
    constructor(helperObj) {
        this.helperObj = helperObj;
        this.getWallet = async (org_name) => {
            console.log(org_name);
            let walletPath = await this.helperObj.getWalletPath(org_name);
            console.log(walletPath);
            let wallet = await fabric_network_1.Wallets.newFileSystemWallet(walletPath);
            return wallet;
        };
        this.evaluateTx = async (channelName, chaincodeName, fcn, username, org_name) => {
            const wallet = await this.getWallet(org_name);
            const gateway = new fabric_network_1.Gateway();
            try {
                const ccp = await this.helperObj.getCCP(org_name);
                let identity = await wallet.get(username);
                if (!identity) {
                    console.log(`An identity for the user ${username} does not exist in the wallet, so register user before retry`);
                    return;
                }
                const connectOptions = this.helperObj.getConnectionObject(wallet, username);
                console.log('Connection Object = ', connectOptions);
                console.log('connecting to gateway');
                await gateway.connect(ccp, connectOptions);
                console.log('connecting to network');
                const network = await gateway.getNetwork(channelName);
                console.log('connecting to contract');
                const contract = await network.getContract(chaincodeName);
                let result;
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
            }
            catch (error) {
                console.log(`Getting error: ${error}`);
                return error.message;
            }
            finally {
                console.log('disconnecting gateway');
                gateway.disconnect();
            }
        };
        this.dry = async (channelName, chaincodeName, args, username, org_name) => {
            const wallet = await this.getWallet(org_name);
            const gateway = new fabric_network_1.Gateway();
            try {
                const ccp = await this.helperObj.getCCP(org_name);
                let identity = await wallet.get(username);
                if (!identity) {
                    console.log(`An identity for the user ${username} does not exist in the wallet, so register user before retry`);
                    return;
                }
                const connectOptions = this.helperObj.getConnectionObject(wallet, username);
                console.log('Connection Object = ', connectOptions);
                await gateway.connect(ccp, connectOptions);
                const network = await gateway.getNetwork(channelName);
                const contract = await network.getContract(chaincodeName);
                let res = await contract.submitTransaction('dry', args[0], args[1]);
                return res;
            }
            catch (err) {
                return err;
            }
            finally {
                console.log('disconnecting gateway');
                gateway.disconnect();
            }
        };
        this.roast = async (channelName, chaincodeName, args, username, org_name) => {
            const wallet = await this.getWallet(org_name);
            const gateway = new fabric_network_1.Gateway();
            try {
                const ccp = await this.helperObj.getCCP(org_name);
                let identity = await wallet.get(username);
                if (!identity) {
                    console.log(`An identity for the user ${username} does not exist in the wallet, so register user before retry`);
                    return;
                }
                const connectOptions = this.helperObj.getConnectionObject(wallet, username);
                console.log('Connection Object = ', connectOptions);
                await gateway.connect(ccp, connectOptions);
                const network = await gateway.getNetwork(channelName);
                const contract = await network.getContract(chaincodeName);
                let res = await contract.submitTransaction('roast', args[0], args[1]);
                return res;
            }
            catch (err) {
                return err;
            }
            finally {
                console.log('disconnecting gateway');
                gateway.disconnect();
            }
        };
        this.doQA = async (channelName, chaincodeName, args, username, org_name) => {
            const wallet = await this.getWallet(org_name);
            const gateway = new fabric_network_1.Gateway();
            try {
                const ccp = await this.helperObj.getCCP(org_name);
                let identity = await wallet.get(username);
                if (!identity) {
                    console.log(`An identity for the user ${username} does not exist in the wallet, so register user before retry`);
                    return;
                }
                const connectOptions = this.helperObj.getConnectionObject(wallet, username);
                console.log('Connection Object = ', connectOptions);
                await gateway.connect(ccp, connectOptions);
                const network = await gateway.getNetwork(channelName);
                const contract = await network.getContract(chaincodeName);
                let res = await contract.submitTransaction('doQA', args[0], args[1]);
                return res;
            }
            catch (err) {
                return err;
            }
            finally {
                console.log('disconnecting gateway');
                gateway.disconnect();
            }
        };
        this.package = async (channelName, chaincodeName, args, username, org_name) => {
            const wallet = await this.getWallet(org_name);
            const gateway = new fabric_network_1.Gateway();
            try {
                const ccp = await this.helperObj.getCCP(org_name);
                let identity = await wallet.get(username);
                if (!identity) {
                    console.log(`An identity for the user ${username} does not exist in the wallet, so register user before retry`);
                    return;
                }
                const connectOptions = this.helperObj.getConnectionObject(wallet, username);
                console.log('Connection Object = ', connectOptions);
                await gateway.connect(ccp, connectOptions);
                const network = await gateway.getNetwork(channelName);
                const contract = await network.getContract(chaincodeName);
                let res = await contract.submitTransaction('package', args[0]);
                return res;
            }
            catch (err) {
                return err;
            }
            finally {
                console.log('disconnecting gateway');
                gateway.disconnect();
            }
        };
        this.dispatch = async (channelName, chaincodeName, args, username, org_name) => {
            const wallet = await this.getWallet(org_name);
            const gateway = new fabric_network_1.Gateway();
            try {
                const ccp = await this.helperObj.getCCP(org_name);
                let identity = await wallet.get(username);
                if (!identity) {
                    console.log(`An identity for the user ${username} does not exist in the wallet, so register user before retry`);
                    return;
                }
                const connectOptions = this.helperObj.getConnectionObject(wallet, username);
                console.log('Connection Object = ', connectOptions);
                await gateway.connect(ccp, connectOptions);
                const network = await gateway.getNetwork(channelName);
                const contract = await network.getContract(chaincodeName);
                let res = await contract.submitTransaction('dispatch', args[0]);
                return res;
            }
            catch (err) {
                return err;
            }
            finally {
                console.log('disconnecting gateway');
                gateway.disconnect();
            }
        };
    }
};
MwccService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [helper_service_1.HelperService])
], MwccService);
exports.MwccService = MwccService;
//# sourceMappingURL=mwcc.service.js.map