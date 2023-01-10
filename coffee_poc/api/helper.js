var { Gateway, Wallets } = require("fabric-network");
const path = require("path");
const FabricCAServices = require("fabric-ca-client");
const fs = require("fs");
const hfc = require("fabric-client");
const util = require("util");
const { log } = require("console");

const helperObj = {};

helperObj.getCCP = async (org) => {
  console.log("getCCP");
  let ccpPath;
  if (org == "teafarm") {
    ccpPath = path.join(
      process.cwd(),
      "./connection-profiles/mfc-prd-config.json"
    );
  } else if (org == "tata") {
    console.log("org");
    ccpPath = path.join(
      process.cwd(),
      "./connection-profiles/mfc-prd-config.json"
    );
  } else if (org == "bigbazar") {
    ccpPath = path.join(
      process.cwd(),
      "./connection-profiles/whs-rtlr-config.json"
    );
  } else if (org == "tatastore") {
    ccpPath = path.join(
      process.cwd(),
      "./connection-profiles/whs-rtlr-config.json"
    );
  }
  console.log(ccpPath);
  const ccpJSON = fs.readFileSync(ccpPath, "utf8");
  const ccp = JSON.parse(ccpJSON);
  return ccp;
};

helperObj.getClientForOrg = async (userorg, username) => {
  console.log("getClientForOrg - ****** START %s %s", userorg, username);
  // get a fabric client loaded with a connection profile for this org
  let config = await helperObj.getCCP(userorg);
  // build a client context and load it with a connection profile
  // lets only load the network settings and save the client for later
  let client = hfc.loadFromConfig(hfc.getConfigSetting("network" + config));
  // This will load a connection profile over the top of the current one one
  // since the first one did not have a client section and the following one does
  // nothing will actually be replaced.
  // This will also set an admin identity because the organization defined in the
  // client section has one defined
  client.loadFromConfig(hfc.getConfigSetting(userorg + config));

  // this will create both the state store and the crypto store based
  // on the settings in the client section of the connection profile
  await client.initCredentialStores();

  // The getUserContext call tries to get the user from persistence.
  // If the user has been saved to persistence then that means the user has
  // been registered and enrolled. If the user is found in persistence
  // the call will then assign the user to the client object.
  if (username) {
    let user = await client.getUserContext(username, true);
    if (!user) {
      throw new Error(util.format("User was not found :", username));
    } else {
      console.log("User %s was found to be registered and enrolled", username);
    }
  }
  console.log("getClientForOrg - ****** END %s %s \n\n", userorg, username);

  return client;
};

helperObj.getCCP = async (org) => {
  let ccpPath;
  if (org == "teafarm") {
    ccpPath = "./connection-profiles/mfc-prd-config.json";
    // ccpPath = "./connection-profiles/mfc-prd-config.json";
  } else if (org == "tata") {
    ccpPath = "./connection-profiles/mfc-prd-config.json";
    // ccpPath = "./connection-profiles/mfc-prd-config.json";
  } else if (org == "tatastore") {
    ccpPath = "./connection-profiles/whs-rtlr-config.json";
    // ccpPath = "./connection-profiles/mfc-prd-config.json";
  } else if (org == "bigbazar") {
    ccpPath = "./connection-profiles/whs-rtlr-config.json";
    // ccpPath = "./connection-profiles/mfc-prd-config.json";
  }
  const ccpJSON = fs.readFileSync(ccpPath, "utf8");
  const ccp = JSON.parse(ccpJSON);
  return ccp;
};

helperObj.getCaUrl = async (org, ccp) => {
  console.log(ccp);
  let caURL;

  if (org == "tata") {
    caURL = ccp.certificateAuthorities["ca.manufacturer.com"].url;
  } else if (org == "teafarm") {
    caURL = ccp.certificateAuthorities["ca.production.com"].url;
    // //console.log("CCP URL = ", caURL);
  } else if (org == "tatastore") {
    caURL = ccp.certificateAuthorities["ca.warehouse.com"].url;
    // //console.log("CCP URL = ", caURL);
  } else if (org == "bigbazar") {
    caURL = ccp.certificateAuthorities["ca.retailer.com"].url;
    // //console.log("CCP URL = ", caURL);
  }
  console.log("caurl   " + caURL);
  return caURL;
};

helperObj.getWalletPath = async (org) => {
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
  return walletPath;
};

helperObj.getCaInfo = async (org, ccp) => {
  let caInfo = {};
  if (org == "tata") {
    caInfo = ccp.certificateAuthorities["ca.manufacturer.com"];
  } else if (org == "teafarm") {
    caInfo = ccp.certificateAuthorities["ca.production.com"];
    //console.log("CA INFO = ",caInfo.tlsCAcerts.path);
  } else if (org == "tatastore") {
    caInfo = ccp.certificateAuthorities["ca.warehouse.com"].url;
    // //console.log("CCP URL = ", caURL);
  } else if (org == "bigbazar") {
    caInfo = ccp.certificateAuthorities["ca.retailer.com"].url;
    // //console.log("CCP URL = ", caURL);
  }
  return caInfo;
};

helperObj.getAffiliation = async (org) => {
  // return org == "tata" ? 'tata' : 'teafarm'
  return org == "teafarm" ? "org1.department1" : "org2.department1";
};

helperObj.getRegisteredUser = async (username, userOrg, isJson) => {
  let ccp = await getCCP(userOrg);
  // //console.log(ccp.certificateAuthorities.caManufacturer.url);
  const caURL = await getCaUrl(userOrg, ccp);
  const ca = new FabricCAServices(caURL);

  const walletPath = await getWalletPath(userOrg);
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  const userIdentity = await wallet.get(username);
  if (userIdentity) {
    //console.log(`An identity for the user ${username} already exists in the wallet`);
    var response = {
      success: true,
      message: username + " enrolled Successfully",
    };
    return response;
  }

  // Check to see if we've already enrolled the admin user.
  let adminIdentity = await wallet.get("admin");
  if (!adminIdentity) {
    console.log(
      'An identity for the admin user "admin" does not exist in the wallet'
    );
    await enrollAdmin(userOrg, ccp);
    adminIdentity = await wallet.get("admin");
    console.log("Admin Enrolled Successfully");
    console.log("***Admnin Identity**** = ", adminIdentity);
  }

  // build a user object for authenticating with the CA
  const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
  const adminUser = await provider.getUserContext(adminIdentity, "admin");
  let secret;
  try {
    // Register the user, enroll the user, and import the new identity into the wallet.
    secret = await ca.register(
      {
        affiliation: await getAffiliation(userOrg),
        enrollmentID: username,
        role: "client",
      },
      adminUser
    );
    // const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: username, role: 'client', attrs: [{ name: 'role', value: 'approver', ecert: true }] }, adminUser);
  } catch (error) {
    return error.message;
  }

  const enrollment = await ca.enroll({
    enrollmentID: username,
    enrollmentSecret: secret,
  });
  // const enrollment = await ca.enroll({ enrollmentID: username, enrollmentSecret: secret, attr_reqs: [{ name: 'role', optional: false }] });

  let x509Identity;
  if (userOrg == "teafarm") {
    x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: "teafarmMSP",
      type: "X.509",
    };
  } else if (userOrg == "tata") {
    x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: "tataMSP",
      type: "X.509",
    };
  }

  await wallet.put(username, x509Identity);
  //console.log(`Successfully registered and enrolled admin user ${username} and imported it into the wallet`);

  var response = {
    success: true,
    message: username + " enrolled Successfully",
  };
  return response;
};

helperObj.enrollAdmin = async (org, ccp) => {
  //console.log('calling enroll Admin method')
  //console.log("Org At 148",org);

  try {
    const caInfo = await getCaInfo(org, ccp); //ccp.certificateAuthorities['ca.org1.example.com'];
    //console.log("caInfo = " ,caInfo);
    const caTLSCACerts = caInfo.tlsCAcerts.path;
    const ca = new FabricCAServices(
      caInfo.url,
      { trustedRoots: caTLSCACerts, verify: false },
      caInfo.caName
    );
    // //console.log("CA = ",ca);
    // Create a new file system based wallet for managing identities.
    const walletPath = await getWalletPath(org); //path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    //console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the admin user.
    const identity = await wallet.get("admin");
    //console.log("identity at line 163 = ", identity);
    if (identity) {
      //console.log('An identity for the admin user "admin" already exists in the wallet');
      return;
    }

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await ca.enroll({
      enrollmentID: "admin",
      enrollmentSecret: "adminpw",
    });
    //console.log("At 171",enrollment);
    //console.log("Org at 172", org);
    let x509Identity;
    if (org == "teafarm") {
      x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: "teafarmMSP",
        type: "X.509",
      };
      //console.log("At 181",x509Identity);
    } else if (org == "tata") {
      x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: "tataMSP",
        type: "X.509",
      };
      //console.log("At 191",x509Identity);
    }

    await wallet.put("admin", x509Identity);
    //console.log("At 196 = ",x509Identity);
    //console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
    return x509Identity;
  } catch (error) {
    //console.error(`Failed to enroll admin user "admin": ${error}`);
  }
};

helperObj.registerAndGerSecret = async (username, userOrg) => {
  let ccp = await getCCP(userOrg);

  const caURL = await getCaUrl(userOrg, ccp);
  const ca = new FabricCAServices(caURL);

  const walletPath = await getWalletPath(userOrg);
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  //console.log(`Wallet path: ${walletPath}`);

  const userIdentity = await wallet.get(username);
  if (userIdentity) {
    //console.log(`An identity for the user ${username} already exists in the wallet`);
    var response = {
      success: true,
      message: username + " enrolled Successfully",
    };
    return response;
  }

  // Check to see if we've already enrolled the admin user.
  let adminIdentity = await wallet.get("admin");
  if (!adminIdentity) {
    //console.log('An identity for the admin user "admin" does not exist in the wallet');
    await enrollAdmin(userOrg, ccp);
    adminIdentity = await wallet.get("admin");
    //console.log("****ADMIN IDENTITY**** = ", adminIdentity);
    //console.log("Admin Enrolled Successfully")
  }

  // build a user object for authenticating with the CA
  const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
  const adminUser = await provider.getUserContext(adminIdentity, "admin");
  let secret;
  try {
    // Register the user, enroll the user, and import the new identity into the wallet.
    secret = await ca.register(
      {
        affiliation: await getAffiliation(userOrg),
        enrollmentID: username,
        role: "client",
      },
      adminUser
    );
    // const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: username, role: 'client', attrs: [{ name: 'role', value: 'approver', ecert: true }] }, adminUser);
  } catch (error) {
    return error.message;
  }

  var response = {
    success: true,
    message: username + " enrolled Successfully",
    secret: secret,
  };
  return response;
};

module.exports = helperObj;
