import { Contract, Context } from 'fabric-contract-api';
export declare class wrcc extends Contract {
    constructor();
    initialize(ctx: Context): Promise<string>;
    returnWarehouseSTockAccordingTomwCC(ctx: Context): Promise<number>;
    updateWarehouseStock(ctx: Context, qty: string, flag: number): Promise<any>;
    availableWarehouseStock(ctx: Context): Promise<number>;
    getRetailerBalance(ctx: Context): Promise<number>;
    updateRetailerBalance(ctx: Context, amt: number, flag: number): Promise<number>;
    getRetailerStock(ctx: Context): Promise<number>;
    updateRetailerStock(ctx: Context, qty: number, flag: number): Promise<void>;
    placeOrder(ctx: Context, qty: number, country: string, state: string): Promise<string>;
    updateStatusToInTransit(ctx: Context, orderNo: string): Promise<string>;
    updateStatusToDelivered(ctx: Context, orderNo: string): Promise<string>;
    getWareHouseBalance(ctx: Context): Promise<number>;
    updateWarehouseBalance(ctx: Context, amt: number, flag: number): Promise<void>;
    getOrderDetails(ctx: Context, orderNo: string): Promise<any>;
    getCurrentOrderNumber(ctx: Context): Promise<number>;
}
