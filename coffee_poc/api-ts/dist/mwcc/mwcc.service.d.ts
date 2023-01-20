import { HelperService } from 'src/helper/helper.service';
export declare class MwccService {
    private helperObj;
    constructor(helperObj: HelperService);
    getWallet: (org_name: any) => Promise<import("fabric-network").Wallet>;
    evaluateTx: (channelName: any, chaincodeName: any, fcn: any, username: any, org_name: any) => Promise<any>;
    dry: (channelName: any, chaincodeName: any, args: any, username: any, org_name: any) => Promise<any>;
    roast: (channelName: any, chaincodeName: any, args: any, username: any, org_name: any) => Promise<any>;
    doQA: (channelName: any, chaincodeName: any, args: any, username: any, org_name: any) => Promise<any>;
    package: (channelName: any, chaincodeName: any, args: any, username: any, org_name: any) => Promise<any>;
    dispatch: (channelName: any, chaincodeName: any, args: any, username: any, org_name: any) => Promise<any>;
}
