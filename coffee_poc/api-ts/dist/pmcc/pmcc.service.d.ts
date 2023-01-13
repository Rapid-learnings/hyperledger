import { HelperService } from 'src/helper/helper.service';
export declare class PmccService {
    private helperObj;
    constructor(helperObj: HelperService);
    getWallet: (org_name: any) => Promise<import("fabric-network").Wallet>;
    evaluateTx: (channelName: any, chaincodeName: any, fcn: any, username: any, org_name: any) => Promise<any>;
    placeOrder: (channelName: any, chaincodeName: any, fcn: any, args: any, username: any, org_name: any) => Promise<any>;
    getOrderDetails: (channelName: any, chaincodeName: any, fcn: any, orderNumber: any, username: any, org_name: any) => Promise<any>;
    orderInTransit: (channelName: any, chaincodeName: any, fcn: any, orderNumber: any, username: any, org_name: any) => Promise<any>;
    orderDelivered: (channelName: any, chaincodeName: any, fcn: any, orderNumber: any, username: any, org_name: any) => Promise<any>;
}
