import { OrderDto } from './dto/order.dto';
import { WrccService } from './wrcc.service';
export declare class WrccController {
    private wr;
    constructor(wr: WrccService);
    initialize(res: any): Promise<void>;
    returnWarehouseSTockAccordingTomwCC(res: any): Promise<void>;
    getWareHouseBalance(res: any): Promise<void>;
    getRetailerBalance(res: any): Promise<void>;
    getRetailerStock(res: any): Promise<void>;
    updateStatusToInTransit(res: any, req: any): Promise<void>;
    placeOrder(body: OrderDto, res: any): Promise<void>;
    updateStatusToDelivered(res: any, req: any): Promise<void>;
    getOrderDetails(res: any, req: any): Promise<void>;
}
