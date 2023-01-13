import { Contract, Context } from "fabric-contract-api";
export declare class pmcc extends Contract {
    constructor();
    init(ctx: Context, initialStock: string): Promise<void>;
    updateProductionStock(ctx: Context, amtInKg: number, flag: number): Promise<number>;
    availableStock(ctx: Context): Promise<number>;
    getManufacturerStock(ctx: Context): Promise<number>;
    updateManufacturerStock(ctx: Context, qty: number): Promise<void>;
    placeOrder(ctx: Context, qty: number, cty: string, stateName: string): Promise<{
        orderNo: number;
        txId: string;
    }>;
    updateStatusToInTransit(ctx: Context, orderNo: string): Promise<void>;
    updateStatusToDelivered(ctx: Context, orderNo: string): Promise<void>;
    getOrderDetails(ctx: Context, orderNo: string): Promise<any>;
    getManufacturerFunds(ctx: Context): Promise<number>;
    getProducerFunds(ctx: Context): Promise<number>;
}
