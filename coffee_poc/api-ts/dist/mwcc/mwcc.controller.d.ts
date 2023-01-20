import { MwccService } from './mwcc.service';
import { mwDto } from './dto/mw.dto';
export declare class MwccController {
    private invokeObjMW;
    constructor(invokeObjMW: MwccService);
    initialize(res: any): Promise<void>;
    returnRawStockAccordingToPMCC(res: any): Promise<void>;
    availableDriedStock(res: any): Promise<void>;
    availableRoastedStock(res: any): Promise<void>;
    availableFinishedStock(res: any): Promise<void>;
    getWastedStock(res: any): Promise<void>;
    getTotalPackages(res: any): Promise<void>;
    dry(body: mwDto, res: any): Promise<void>;
    roast(body: mwDto, res: any): Promise<void>;
    doQA(body: mwDto, res: any): Promise<void>;
    package(body: mwDto, res: any): Promise<void>;
    dispatch(res: any, body: mwDto): Promise<void>;
}
