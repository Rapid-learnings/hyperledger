import { Injectable } from '@nestjs/common';
import { HelperService } from 'src/helper/helper.service';
import FabricCAServices from 'fabric-ca-client';
var { Gateway, Wallets } = require('fabric-network');
import path from 'path';

@Injectable()
export class UserService {
  constructor(private helperObj: HelperService) {}
  async enrollAdmin(org: String) {
    try {
      // load the network configuration
      const ccp = await this.helperObj.getCCP(org);
      console.log(ccp);

      // Create a new CA client for interacting with the CA.
      let caInfo: any = {};
      // if (org == "tata") {
      //   caInfo = ccp.certificateAuthorities["ca.manufacturer.com"];
      // } else if (org == "teafarm") {
      //   caInfo = ccp.certificateAuthorities["ca.production.com"];
      // } else if (org == "tatastore") {
      //   caInfo = ccp.certificateAuthorities["ca.warehouse.com"];
      // } else if (org == "bigbazar") {
      //   caInfo = ccp.certificateAuthorities["ca.retailer.com"];
      // }
      caInfo = await this.helperObj.getCaInfo(org, ccp);
      console.log('caInfo = ', caInfo);
      // console.log(caInfo.tlsCAcerts.pem);
      const caTLSCACerts = caInfo.tlsCAcerts.path;

      console.log('************** caTLSCACerts ***************', caTLSCACerts);

      const ca = new FabricCAServices(
        caInfo.url,
        { trustedRoots: caTLSCACerts, verify: false },
        caInfo.caName,
      );
      console.log('\n\n*********** CA **********\n\n', ca);

      // Create a new file system based wallet for managing identities.
      let walletPath = await this.helperObj.getWalletPath(org);
      console.log('wallet path =', walletPath);

      // if (org == "tata") {
      //   walletPath = path.join(process.cwd(), "tata-wallet");
      // } else if (org == "teafarm") {
      //   walletPath = path.join(process.cwd(), "teafarm-wallet");
      // } else if (org == "tatastore") {
      //   walletPath = path.join(process.cwd(), "tatastore-wallet");
      // } else if (org == "bigbazar") {
      //   walletPath = path.join(process.cwd(), "bigbazar-wallet");
      // }
      const wallet = await Wallets.newFileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);

      // Check to see if we've already enrolled the admin user.
      const identity = await wallet.get('admin');
      if (identity) {
        console.log(
          'An identity for the admin user "admin" already exists in the wallet',
        );
        return;
      }

      // Enroll the admin user, and import the new identity into the wallet.
      const enrollment = await ca.enroll({
        enrollmentID: 'admin',
        enrollmentSecret: 'adminpw',
      });
      let x509Identity: any;
      if (org == 'tata') {
        x509Identity = {
          credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
          },
          mspId: 'tataMSP',
          type: 'X.509',
        };
      } else if (org == 'teafarm') {
        x509Identity = {
          credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
          },
          mspId: 'teafarmMSP',
          type: 'X.509',
        };
      } else if (org == 'tatastore') {
        x509Identity = {
          credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
          },
          mspId: 'tatastoreMSP',
          type: 'X.509',
        };
      } else if (org == 'bigbazar') {
        x509Identity = {
          credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
          },
          mspId: 'bigbazarMSP',
          type: 'X.509',
        };
      }
      await wallet.put('admin', x509Identity);
      console.log(
        'Successfully enrolled admin user "admin" and imported it into the wallet',
      );
    } catch (error) {
      console.error(`Failed to enroll admin user "admin": ${error}`);
      process.exit(1);
    }
  }

  async registerEnrollUser(usr: string, org: string) {
    try {
      // load the network configuration
      // const ccpPath = await this.getCCP(org);
      const ccp = await this.helperObj.getCCP(org);

      // Create a new CA client for interacting with the CA.
      let caURL = await this.helperObj.getCaUrl(org, ccp);
      // if (org == "tata") {
      //   caURL = ccp.certificateAuthorities["ca.manufacturer.com"].url;
      // } else if (org == "teafarm") {
      //   caURL = ccp.certificateAuthorities["ca.production.com"].url;
      // } else if (org == "tatastore") {
      //   caURL = ccp.certificateAuthorities["ca.warehouse.com"].url;
      // } else if (org == "bigbazar") {
      //   caURL = ccp.certificateAuthorities["ca.retailer.com"].url;
      // }
      console.log('CA URL = ', caURL);
      const ca = new FabricCAServices(caURL);
      // console.log("CA = ", ca);
      // Create a new file system based wallet for managing identities.
      let walletPath = await this.helperObj.getWalletPath(org);
      const wallet = await Wallets.newFileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);

      // Check to see if we've already enrolled the user.
      const userIdentity = await wallet.get(usr);
      if (userIdentity) {
        console.log(
          'An identity for the user "appUser" already exists in the wallet',
        );
        return;
      }

      // Check to see if we've already enrolled the admin user.
      const adminIdentity = await wallet.get('admin');
      if (!adminIdentity) {
        console.log(
          'An identity for the admin user "admin" does not exist in the wallet',
        );
        console.log('Run the enrollAdmin.js application before retrying');
        return;
      }

      // build a user object for authenticating with the CA
      const provider = wallet
        .getProviderRegistry()
        .getProvider(adminIdentity.type);

      // console.log("\n====== provider ===== \n", provider);

      const adminUser = await provider.getUserContext(adminIdentity, 'admin');

      // Register the user, enroll the user, and import the new identity into the wallet.
      const secret = await ca.register(
        {
          affiliation: await this.helperObj.getAffiliation(org),
          enrollmentID: usr,
          role: 'client',
        },
        adminUser,
      );

      // console.log("====== Secret ===== \n", secret);

      const enrollment = await ca.enroll({
        enrollmentID: usr,
        enrollmentSecret: secret,
      });

      // console.log("\n====== Enrollment ===== \n", enrollment);
      let x509Identity;
      if (org == 'tata') {
        x509Identity = {
          credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
          },
          mspId: 'tataMSP',
          type: 'X.509',
        };
      } else if (org == 'teafarm') {
        x509Identity = {
          credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
          },
          mspId: 'teafarmMSP',
          type: 'X.509',
        };
      } else if (org == 'tatastore') {
        x509Identity = {
          credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
          },
          mspId: 'tatastoreMSP',
          type: 'X.509',
        };
      } else if (org == 'bigbazar') {
        x509Identity = {
          credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
          },
          mspId: 'bigbazarMSP',
          type: 'X.509',
        };
      }
      console.log('\n====== x509Identity ===== \n', x509Identity);

      await wallet.put(usr, x509Identity);
      console.log(
        'Successfully registered and enrolled user' +
          `${usr}` +
          ' and imported it into the wallet',
      );
    } catch (error) {
      console.error('Failed to register user ' + `${usr}` + ' : ' + `${error}`);
      process.exit(1);
    }
  }
}
