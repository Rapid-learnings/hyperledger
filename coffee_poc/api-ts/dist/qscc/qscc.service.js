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
exports.QsccService = void 0;
const common_1 = require("@nestjs/common");
const helper_service_1 = require("../helper/helper.service");
const util = require('util');
const { Gateway, Wallets } = require('fabric-network');
const { BlockDecoder } = require('fabric-common');
const fs = require('fs');
let QsccService = class QsccService {
    constructor(helperObj) {
        this.helperObj = helperObj;
    }
    async qscc(channelName, chaincodeName, args, fcn, username, org_name) {
        console.log('====query.js====', org_name, username);
        try {
            const ccp = await this.helperObj.getCCP(org_name);
            const walletPath = await this.helperObj.getWalletPath(org_name);
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
            let identity = await wallet.get(username);
            if (!identity) {
                console.log(`An identity for the user ${username} does not exist in the wallet, so registering user`);
                return;
            }
            const gateway = new Gateway();
            await gateway.connect(ccp, {
                wallet,
                identity: username,
                discovery: { enabled: true, asLocalhost: true },
            });
            const network = await gateway.getNetwork(channelName);
            const contract = network.getContract(chaincodeName);
            let result;
            if (fcn == 'GetBlockByNumber') {
                result = await contract.evaluateTransaction(fcn, channelName, args);
                result = BlockDecoder.decode(result);
            }
            else if (fcn == 'GetTransactionByID') {
                console.log('Enter');
                result = await contract.evaluateTransaction(fcn, channelName, args);
                result = BlockDecoder.decodeTransaction(result);
            }
            return result;
        }
        catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            return error.message;
        }
    }
};
QsccService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [helper_service_1.HelperService])
], QsccService);
exports.QsccService = QsccService;
//# sourceMappingURL=qscc.service.js.map