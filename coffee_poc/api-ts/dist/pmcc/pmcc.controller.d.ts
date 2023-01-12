import { PmccService } from './pmcc.service';
import { OrderDto } from './dto/order.dto';
export declare class PmccController {
    private invokeObj;
    constructor(invokeObj: PmccService);
    getProducerStorage(res: any): Promise<void>;
    getManufacturerStock(res: any): Promise<void>;
    getManufacturerFunds(res: any): Promise<void>;
    getOrderDetails(req: any, res: any): Promise<void>;
    initPmcc(req: any, res: any): Promise<void>;
    placeOrder(req: any, order: OrderDto, res: any): Promise<void>;
    updateStatusToInTransit(req: any, res: any): Promise<void>;
    updateStatusToDelivered(req: any, res: any): Promise<void>;
}
