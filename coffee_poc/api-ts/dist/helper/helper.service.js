"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelperService = void 0;
const common_1 = require("@nestjs/common");
var { Gateway, Wallets } = require('fabric-network');
const path_1 = __importDefault(require("path"));
const fabric_ca_client_1 = __importDefault(require("fabric-ca-client"));
const fs = require('fs');
const fabric_client_1 = __importDefault(require("fabric-client"));
const util_1 = __importDefault(require("util"));
const { log } = require('console');
let HelperService = class HelperService {
    constructor() {
        this.getCCP = async (org) => {
            console.log('getCCP');
            let ccpPath;
            if (org == 'teafarm') {
                ccpPath = path_1.default.join(process.cwd(), '/src/helper/connection-profiles/mfc-prd-config.json');
            }
            else if (org == 'tata') {
                console.log('org', process.cwd());
                ccpPath = path_1.default.join(process.cwd(), '/src/helper/connection-profiles/mfc-prd-config.json');
            }
            else if (org == 'bigbazar') {
                ccpPath = path_1.default.join(process.cwd(), '/src/helper/connection-profiles/whs-rtlr-config.json');
            }
            else if (org == 'tatastore') {
                console.log('org  ', process.cwd());
                ccpPath = path_1.default.join(process.cwd(), '/src/helper/connection-profiles/whs-rtlr-config.json');
            }
            console.log(ccpPath);
            const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
            const ccp = JSON.parse(ccpJSON);
            return ccp;
        };
        this.getClientForOrg = async (userorg, username) => {
            console.log('getClientForOrg - ****** START %s %s', userorg, username);
            let config = await this.getCCP(userorg);
            let client = fabric_client_1.default.loadFromConfig(fabric_client_1.default.getConfigSetting('network' + config));
            client.loadFromConfig(fabric_client_1.default.getConfigSetting(userorg + config));
            await client.initCredentialStores();
            if (username) {
                let user = await client.getUserContext(username, true);
                if (!user) {
                    throw new Error(util_1.default.format('User was not found :', username));
                }
                else {
                    console.log('User %s was found to be registered and enrolled', username);
                }
            }
            console.log('getClientForOrg - ****** END %s %s \n\n', userorg, username);
            return client;
        };
        this.getCaUrl = async (org, ccp) => {
            console.log(ccp);
            let caURL;
            if (org == 'tata') {
                caURL = ccp.certificateAuthorities['ca.manufacturer.com'].url;
            }
            else if (org == 'teafarm') {
                caURL = ccp.certificateAuthorities['ca.production.com'].url;
            }
            else if (org == 'tatastore') {
                caURL = ccp.certificateAuthorities['ca.warehouse.com'].url;
            }
            else if (org == 'bigbazar') {
                caURL = ccp.certificateAuthorities['ca.retailer.com'].url;
            }
            console.log('caurl   ' + caURL);
            return caURL;
        };
        this.getWalletPath = async (org) => {
            let walletPath;
            if (org == 'tata') {
                walletPath = path_1.default.join(process.cwd(), '/src/helper/tata-wallet');
            }
            else if (org == 'teafarm') {
                walletPath = path_1.default.join(process.cwd(), '/src/helper/teafarm-wallet');
            }
            else if (org == 'tatastore') {
                walletPath = path_1.default.join(process.cwd(), '/src/helper/tatastore-wallet');
            }
            else if (org == 'bigbazar') {
                walletPath = path_1.default.join(process.cwd(), '/src/helper/bigbazar-wallet');
            }
            return walletPath;
        };
        this.getCaInfo = async (org, ccp) => {
            let caInfo = {};
            if (org == 'tata') {
                caInfo = ccp.certificateAuthorities['ca.manufacturer.com'];
            }
            else if (org == 'teafarm') {
                caInfo = ccp.certificateAuthorities['ca.production.com'];
            }
            else if (org == 'tatastore') {
                caInfo = ccp.certificateAuthorities['ca.warehouse.com'];
            }
            else if (org == 'bigbazar') {
                caInfo = ccp.certificateAuthorities['ca.retailer.com'];
            }
            return caInfo;
        };
        this.getAffiliation = async (org) => {
            return org == 'teafarm' ? 'org1.department1' : 'org2.department1';
        };
        this.getRegisteredUser = async (username, userOrg, isJson) => {
            let ccp = await this.getCCP(userOrg);
            const caURL = await this.getCaUrl(userOrg, ccp);
            const ca = new fabric_ca_client_1.default(caURL);
            const walletPath = await this.getWalletPath(userOrg);
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            const userIdentity = await wallet.get(username);
            if (userIdentity) {
                var response = {
                    success: true,
                    message: username + ' enrolled Successfully',
                };
                return response;
            }
            let adminIdentity = await wallet.get('admin');
            if (!adminIdentity) {
                console.log('An identity for the admin user "admin" does not exist in the wallet');
                await this.enrollAdmin(userOrg, ccp);
                adminIdentity = await wallet.get('admin');
                console.log('Admin Enrolled Successfully');
                console.log('***Admnin Identity**** = ', adminIdentity);
            }
            const provider = wallet
                .getProviderRegistry()
                .getProvider(adminIdentity.type);
            const adminUser = await provider.getUserContext(adminIdentity, 'admin');
            let secret;
            try {
                secret = await ca.register({
                    affiliation: await this.getAffiliation(userOrg),
                    enrollmentID: username,
                    role: 'client',
                }, adminUser);
            }
            catch (error) {
                return error.message;
            }
            const enrollment = await ca.enroll({
                enrollmentID: username,
                enrollmentSecret: secret,
            });
            let x509Identity;
            if (userOrg == 'teafarm') {
                x509Identity = {
                    credentials: {
                        certificate: enrollment.certificate,
                        privateKey: enrollment.key.toBytes(),
                    },
                    mspId: 'teafarmMSP',
                    type: 'X.509',
                };
            }
            else if (userOrg == 'tata') {
                x509Identity = {
                    credentials: {
                        certificate: enrollment.certificate,
                        privateKey: enrollment.key.toBytes(),
                    },
                    mspId: 'tataMSP',
                    type: 'X.509',
                };
            }
            await wallet.put(username, x509Identity);
            var response = {
                success: true,
                message: username + ' enrolled Successfully',
            };
            return response;
        };
        this.enrollAdmin = async (org, ccp) => {
            try {
                const caInfo = await this.getCaInfo(org, ccp);
                const caTLSCACerts = caInfo.tlsCAcerts.path;
                const ca = new fabric_ca_client_1.default(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
                const walletPath = await this.getWalletPath(org);
                const wallet = await Wallets.newFileSystemWallet(walletPath);
                const identity = await wallet.get('admin');
                if (identity) {
                    return;
                }
                const enrollment = await ca.enroll({
                    enrollmentID: 'admin',
                    enrollmentSecret: 'adminpw',
                });
                let x509Identity;
                if (org == 'teafarm') {
                    x509Identity = {
                        credentials: {
                            certificate: enrollment.certificate,
                            privateKey: enrollment.key.toBytes(),
                        },
                        mspId: 'teafarmMSP',
                        type: 'X.509',
                    };
                }
                else if (org == 'tata') {
                    x509Identity = {
                        credentials: {
                            certificate: enrollment.certificate,
                            privateKey: enrollment.key.toBytes(),
                        },
                        mspId: 'tataMSP',
                        type: 'X.509',
                    };
                }
                await wallet.put('admin', x509Identity);
                return x509Identity;
            }
            catch (error) {
            }
        };
        this.registerAndGerSecret = async (username, userOrg) => {
            let ccp = await this.getCCP(userOrg);
            const caURL = await this.getCaUrl(userOrg, ccp);
            const ca = new fabric_ca_client_1.default(caURL);
            const walletPath = await this.getWalletPath(userOrg);
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            const userIdentity = await wallet.get(username);
            if (userIdentity) {
                var res = {
                    success: true,
                    message: username + ' enrolled Successfully',
                };
                return res;
            }
            let adminIdentity = await wallet.get('admin');
            if (!adminIdentity) {
                await this.enrollAdmin(userOrg, ccp);
                adminIdentity = await wallet.get('admin');
            }
            const provider = wallet
                .getProviderRegistry()
                .getProvider(adminIdentity.type);
            const adminUser = await provider.getUserContext(adminIdentity, 'admin');
            let secret;
            try {
                secret = await ca.register({
                    affiliation: await this.getAffiliation(userOrg),
                    enrollmentID: username,
                    role: 'client',
                }, adminUser);
            }
            catch (error) {
                return error.message;
            }
            let response = {
                success: true,
                message: username + ' enrolled Successfully',
                secret: secret,
            };
            return response;
        };
    }
};
HelperService = __decorate([
    (0, common_1.Injectable)()
], HelperService);
exports.HelperService = HelperService;
//# sourceMappingURL=helper.service.js.map