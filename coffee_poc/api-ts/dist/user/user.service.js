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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const helper_service_1 = require("../helper/helper.service");
const fabric_ca_client_1 = __importDefault(require("fabric-ca-client"));
var { Gateway, Wallets } = require("fabric-network");
let UserService = class UserService {
    constructor(helperObj) {
        this.helperObj = helperObj;
    }
    async enrollAdmin(org) {
        try {
            const ccp = await this.helperObj.getCCP(org);
            console.log(ccp);
            let caInfo = {};
            caInfo = await this.helperObj.getCaInfo(org, ccp);
            console.log("caInfo = ", caInfo);
            const caTLSCACerts = caInfo.tlsCAcerts.path;
            console.log("************** caTLSCACerts ***************", caTLSCACerts);
            const ca = new fabric_ca_client_1.default(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
            console.log("\n\n*********** CA **********\n\n", ca);
            let walletPath = await this.helperObj.getWalletPath(org);
            console.log("wallet path =", walletPath);
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
            const identity = await wallet.get("admin");
            if (identity) {
                console.log('An identity for the admin user "admin" already exists in the wallet');
                return;
            }
            const enrollment = await ca.enroll({
                enrollmentID: "admin",
                enrollmentSecret: "adminpw",
            });
            let x509Identity;
            if (org == "tata") {
                x509Identity = {
                    credentials: {
                        certificate: enrollment.certificate,
                        privateKey: enrollment.key.toBytes(),
                    },
                    mspId: "tataMSP",
                    type: "X.509",
                };
            }
            else if (org == "teafarm") {
                x509Identity = {
                    credentials: {
                        certificate: enrollment.certificate,
                        privateKey: enrollment.key.toBytes(),
                    },
                    mspId: "teafarmMSP",
                    type: "X.509",
                };
            }
            else if (org == "tatastore") {
                x509Identity = {
                    credentials: {
                        certificate: enrollment.certificate,
                        privateKey: enrollment.key.toBytes(),
                    },
                    mspId: "tatastoreMSP",
                    type: "X.509",
                };
            }
            else if (org == "bigbazar") {
                x509Identity = {
                    credentials: {
                        certificate: enrollment.certificate,
                        privateKey: enrollment.key.toBytes(),
                    },
                    mspId: "bigbazarMSP",
                    type: "X.509",
                };
            }
            await wallet.put("admin", x509Identity);
            console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
        }
        catch (error) {
            console.error(`Failed to enroll admin user "admin": ${error}`);
            process.exit(1);
        }
    }
    async registerEnrollUser(usr, org) {
        try {
            const ccp = await this.helperObj.getCCP(org);
            let caURL = await this.helperObj.getCaUrl(org, ccp);
            console.log("CA URL = ", caURL);
            const ca = new fabric_ca_client_1.default(caURL);
            let walletPath = await this.helperObj.getWalletPath(org);
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
            const userIdentity = await wallet.get(usr);
            if (userIdentity) {
                console.log('An identity for the user "appUser" already exists in the wallet');
                return;
            }
            const adminIdentity = await wallet.get("admin");
            if (!adminIdentity) {
                console.log('An identity for the admin user "admin" does not exist in the wallet');
                console.log("Run the enrollAdmin.js application before retrying");
                return;
            }
            const provider = wallet
                .getProviderRegistry()
                .getProvider(adminIdentity.type);
            const adminUser = await provider.getUserContext(adminIdentity, "admin");
            const secret = await ca.register({
                affiliation: await this.helperObj.getAffiliation(org),
                enrollmentID: usr,
                role: "client",
            }, adminUser);
            const enrollment = await ca.enroll({
                enrollmentID: usr,
                enrollmentSecret: secret,
            });
            let x509Identity;
            if (org == "tata") {
                x509Identity = {
                    credentials: {
                        certificate: enrollment.certificate,
                        privateKey: enrollment.key.toBytes(),
                    },
                    mspId: "tataMSP",
                    type: "X.509",
                };
            }
            else if (org == "teafarm") {
                x509Identity = {
                    credentials: {
                        certificate: enrollment.certificate,
                        privateKey: enrollment.key.toBytes(),
                    },
                    mspId: "teafarmMSP",
                    type: "X.509",
                };
            }
            else if (org == "tatastore") {
                x509Identity = {
                    credentials: {
                        certificate: enrollment.certificate,
                        privateKey: enrollment.key.toBytes(),
                    },
                    mspId: "tatastoreMSP",
                    type: "X.509",
                };
            }
            else if (org == "bigbazar") {
                x509Identity = {
                    credentials: {
                        certificate: enrollment.certificate,
                        privateKey: enrollment.key.toBytes(),
                    },
                    mspId: "bigbazarMSP",
                    type: "X.509",
                };
            }
            console.log("\n====== x509Identity ===== \n", x509Identity);
            await wallet.put(usr, x509Identity);
            console.log("Successfully registered and enrolled user" +
                `${usr}` +
                " and imported it into the wallet");
        }
        catch (error) {
            console.error("Failed to register user " + `${usr}` + " : " + `${error}`);
            process.exit(1);
        }
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [helper_service_1.HelperService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map