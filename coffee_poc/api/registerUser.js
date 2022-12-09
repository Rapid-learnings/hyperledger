/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const {
  Wallets,
  FileSystemWallet,
  Gateway,
  X509WalletMixin,
} = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const fs = require("fs");
const path = require("path");
// const { enroll } = require("./enrollAdmin");

const registerUser = {};

registerUser.getAffiliation = async (org) => {
  // return org == "tata" ? 'tata' : 'teafarm'
  return org == "teafarm" ? "org1.department1" : "org2.department1";
};

registerUser.getWalletPath = async (org) => {
  let walletPath;
  if (org == "tata") {
    walletPath = path.join(process.cwd(), "tata-wallet");
  } else if (org == "teafarm") {
    walletPath = path.join(process.cwd(), "teafarm-wallet");
  } else if (org == "tatastore") {
    walletPath = path.join(process.cwd(), "tatastore-wallet");
  } else if (org == "bigbazar") {
    walletPath = path.join(process.cwd(), "bigbazar-wallet");
  } else return null;
  return walletPath;
};

registerUser.getCCP = async (org) => {
  const ccpPath = path.join(process.cwd(), './connection-profiles/mfc-prd-config.json');
  // if (org == "teafarm") {
  //   ccpPath = "./connection-profiles/mfc-prd-config.json";
  // } else if (org == "tata") {
  //   ccpPath = "./connection-profiles/mfc-prd-config.json";
  // } else return null;
  const ccpJSON = fs.readFileSync(ccpPath, "utf8");
  const ccp = JSON.parse(ccpJSON);
  return ccp;
};

registerUser.registerEnrollUser = async (usr, org) => {
  try {
    // load the network configuration
    // const ccpPath = await this.getCCP(org);
    const ccp = await registerUser.getCCP(org);

    // Create a new CA client for interacting with the CA.
    let caURL;
    if (org == "tata") {
      caURL = ccp.certificateAuthorities["ca.manufacturer.com"].url;
    } else if (org == "teafarm") {
      caURL = ccp.certificateAuthorities["ca.production.com"].url;
    } else if (org == "tatastore") {
      caURL = ccp.certificateAuthorities["ca.warehouse.com"].url;
    } else if (org == "bigbazar") {
      caURL = ccp.certificateAuthorities["ca.retailer.com"].url;
    }
    // console.log("CA URL = ", caURL);
    const ca = new FabricCAServices(caURL);
    // console.log("CA = ", ca);
    // Create a new file system based wallet for managing identities.
    let walletPath = await registerUser.getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userIdentity = await wallet.get(usr);
    if (userIdentity) {
      console.log(
        'An identity for the user "appUser" already exists in the wallet'
      );
      return;
    }

    // Check to see if we've already enrolled the admin user.
    const adminIdentity = await wallet.get("admin");
    if (!adminIdentity) {
      console.log(
        'An identity for the admin user "admin" does not exist in the wallet'
      );
      console.log("Run the enrollAdmin.js application before retrying");
      return;
    }

    // build a user object for authenticating with the CA
    const provider = wallet
      .getProviderRegistry()
      .getProvider(adminIdentity.type);

    // console.log("\n====== provider ===== \n", provider);

    const adminUser = await provider.getUserContext(adminIdentity, "admin");

    // Register the user, enroll the user, and import the new identity into the wallet.
    const secret = await ca.register(
      {
        affiliation: await registerUser.getAffiliation(org),
        enrollmentID: usr,
        role: "client",
      },
      adminUser
    );

    // console.log("====== Secret ===== \n", secret);

    const enrollment = await ca.enroll({
      enrollmentID: usr,
      enrollmentSecret: secret,
    });

    // console.log("\n====== Enrollment ===== \n", enrollment);
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
    } else if (org == "teafarm") {
      x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: "teafarmMSP",
        type: "X.509",
      };
    } else if (org == "tatastore") {
      x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: "tatastoreMSP",
        type: "X.509",
      };
    } else if (org == "bigbazar") {
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
    console.log(
      "Successfully registered and enrolled user" +
        `${usr}` +
        " and imported it into the wallet"
    );
  } catch (error) {
    console.error("Failed to register user " + `${usr}` + " : " + `${error}`);
    process.exit(1);
  }
};

module.exports = registerUser;
// let user = 'user1'
// let org = 'teafarm'
// registerUser.registerEnrollUser(user, org);
