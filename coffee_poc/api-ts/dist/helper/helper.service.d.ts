import hfc from 'fabric-client';
export declare class HelperService {
    getCCP: (org: any) => Promise<any>;
    getClientForOrg: (userorg: any, username: any) => Promise<hfc>;
    getCaUrl: (org: any, ccp: any) => Promise<any>;
    getWalletPath: (org: any) => Promise<any>;
    getCaInfo: (org: any, ccp: any) => Promise<{}>;
    getAffiliation: (org: any) => Promise<"org1.department1" | "org2.department1">;
    getRegisteredUser: (username: any, userOrg: any, isJson: any) => Promise<any>;
    enrollAdmin: (org: any, ccp: any) => Promise<any>;
    registerAndGerSecret: (username: any, userOrg: any) => Promise<any>;
}
