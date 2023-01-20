import { HelperService } from 'src/helper/helper.service';
export declare class QsccService {
    private helperObj;
    constructor(helperObj: HelperService);
    qscc(channelName: string, chaincodeName: string, args: string, fcn: string, username: string, org_name: string): Promise<any>;
}
