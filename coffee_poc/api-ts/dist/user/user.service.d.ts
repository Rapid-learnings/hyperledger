import { HelperService } from 'src/helper/helper.service';
export declare class UserService {
    private helperObj;
    constructor(helperObj: HelperService);
    enrollAdmin(org: String): Promise<void>;
    registerEnrollUser(usr: string, org: string): Promise<void>;
}
