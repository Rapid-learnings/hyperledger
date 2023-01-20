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
exports.WrccService = void 0;
const common_1 = require("@nestjs/common");
const fabric_network_1 = require("fabric-network");
const helper_service_1 = require("../helper/helper.service");
let WrccService = class WrccService {
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
            try {
                const ccp = await this.helperObj.getCCP(org_name);
                const wallet = await this.getWallet(org_name);
                const connectOptions = this.helperObj.getConnectionObject(wallet, username);
                console.log('Connection Object = ', connectOptions);
                const gateway = new fabric_network_1.Gateway();
                await gateway.connect(ccp, connectOptions);
                const network = await gateway.getNetwork('whs-rtlr-channel');
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
                    default:
                        break;
                }
                await gateway.disconnect();
                return result;
            }
            catch (error) {
                console.log(`Getting error: ${error}`);
                return error.message;
            }
        };
        this.placeOrder = async (channelName, chaincodeName, fcn, args, username, org_name) => {
            try {
                const gateway = new fabric_network_1.Gateway();
                console.log(fcn, args, username, org_name);
                const ccp = await this.helperObj.getCCP(org_name);
                let wallet = await this.getWallet(org_name);
                const connectOptions = await this.helperObj.getConnectionObject(wallet, username);
                await gateway.connect(ccp, connectOptions);
                let network = await gateway.getNetwork('whs-rtlr-channel');
                let contract = await network.getContract('wrcc');
                let result;
                console.log(args);
                let txId = await contract.submitTransaction('placeOrder', args[0], args[1], args[2]);
                const listener = async (event) => {
                    if (event.eventName === 'place-order') {
                        const details = event.payload.toString('utf8');
                        console.log('details = ', details);
                        event = JSON.parse(details);
                        console.log('event = ', event);
                        result = event;
                    }
                };
                await contract.addContractListener(listener);
                await gateway.disconnect();
                console.log('result', result);
                return { result: result, txId: txId };
            }
            catch (err) {
                return err;
            }
        };
        this.orderInTransit = async (channelName, chaincodeName, fcn, orderNumber, username, org_name) => {
            try {
                const gateway = new fabric_network_1.Gateway();
                const ccp = await this.helperObj.getCCP(org_name);
                let wallet = await this.getWallet(org_name);
                const connectOptions = await this.helperObj.getConnectionObject(wallet, username);
                await gateway.connect(ccp, connectOptions);
                let network = await gateway.getNetwork('whs-rtlr-channel');
                let contract = await network.getContract('wrcc');
                let result;
                result = await contract.submitTransaction('updateStatusToInTransit', orderNumber);
                console.log(result);
                await gateway.disconnect();
                result = result.toString();
                return result;
            }
            catch (err) {
                return err;
            }
        };
        this.orderDelivered = async (channelName, chaincodeName, fcn, orderNumber, username, org_name) => {
            try {
                const gateway = new fabric_network_1.Gateway();
                const ccp = await this.helperObj.getCCP(org_name);
                let wallet = await this.getWallet(org_name);
                const connectOptions = await this.helperObj.getConnectionObject(wallet, username);
                await gateway.connect(ccp, connectOptions);
                let network = await gateway.getNetwork('whs-rtlr-channel');
                let contract = await network.getContract('wrcc');
                let result;
                result = await contract.submitTransaction('updateStatusToDelivered', orderNumber);
                console.log(result);
                await gateway.disconnect();
                result = result.toString();
                return result;
            }
            catch (err) {
                return err;
            }
        };
        this.getOrderDetails = async (channelName, chaincodeName, fcn, orderNumber, username, org_name) => {
            try {
                const ccp = await this.helperObj.getCCP(org_name);
                const wallet = await this.getWallet(org_name);
                const connectionOptions = this.helperObj.getConnectionObject(wallet, username);
                const gateway = new fabric_network_1.Gateway();
                await gateway.connect(ccp, connectionOptions);
                const network = await gateway.getNetwork(channelName);
                const chainCode = await network.getContract(chaincodeName);
                let result = await chainCode.submitTransaction(fcn, orderNumber);
                await gateway.disconnect();
                result = result.toString();
                console.log('Order Details = ', result);
                return result;
            }
            catch (err) {
                return err;
            }
        };
    }
};
WrccService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [helper_service_1.HelperService])
], WrccService);
exports.WrccService = WrccService;
//# sourceMappingURL=wrcc.service.js.map