/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const FabricCAServices = require("fabric-ca-client");
const { Wallets } = require("fabric-network");
const fs = require("fs");
const path = require("path");

const enrollAdmin = {};

enrollAdmin.getCCP = async (org) => {
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

enrollAdmin.enroll = async (org) => {
  try {
    // load the network configuration
    const ccp = await enrollAdmin.getCCP(org);

    // Create a new CA client for interacting with the CA.
    let caInfo = {};
    if (org == "tata") {
      caInfo = ccp.certificateAuthorities["ca.manufacturer.com"];
    } else if (org == "teafarm") {
      caInfo = ccp.certificateAuthorities["ca.production.com"];
    } else if (org == "tatastore") {
      caInfo = ccp.certificateAuthorities["ca.warehouse.com"];
    } else if (org == "bigbazar") {
      caInfo = ccp.certificateAuthorities["ca.retailer.com"];
    }
    // console.log(caInfo);
    // console.log(caInfo.tlsCAcerts.pem);
    const caTLSCACerts = caInfo.tlsCAcerts.path;
    const ca = new FabricCAServices(
      caInfo.url,
      { trustedRoots: caTLSCACerts, verify: false },
      caInfo.caName
    );

    // Create a new file system based wallet for managing identities.
    let walletPath;
    if (org == "tata") {
      walletPath = path.join(process.cwd(), "tata-wallet");
    } else if (org == "teafarm") {
      walletPath = path.join(process.cwd(), "teafarm-wallet");
    } else if (org == "tatastore") {
      walletPath = path.join(process.cwd(), "tatastore-wallet");
    } else if (org == "bigbazar") {
      walletPath = path.join(process.cwd(), "bigbazar-wallet");
    }
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the admin user.
    const identity = await wallet.get("admin");
    if (identity) {
      console.log(
        'An identity for the admin user "admin" already exists in the wallet'
      );
      return;
    }

    // Enroll the admin user, and import the new identity into the wallet.
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
    await wallet.put("admin", x509Identity);
    console.log(
      'Successfully enrolled admin user "admin" and imported it into the wallet'
    );
  } catch (error) {
    console.error(`Failed to enroll admin user "admin": ${error}`);
    process.exit(1);
  }
};

module.exports = enrollAdmin;
// let org = 'teafarm'
// enrollAdmin.enroll(org)
// enrollAdmin();
