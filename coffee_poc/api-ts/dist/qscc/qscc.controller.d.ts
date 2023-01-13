import { QsccService } from './qscc.service';
export declare class QsccController {
    private queryObj;
    constructor(queryObj: QsccService);
    queryQscc(req: any, res: any): Promise<void>;
}
