import { Contract, Context } from 'fabric-contract-api';
export declare class mwcc extends Contract {
    constructor();
    initialize(ctx: Context): Promise<string>;
    returnRawStockAccordingToPMCC(ctx: Context): Promise<number>;
    updateRawStock(ctx: Context, amt: string, flag: number): Promise<void>;
    availableRawStock(ctx: Context): Promise<number>;
    availableDriedStock(ctx: Context): Promise<number>;
    availableRoastedStock(ctx: Context): Promise<number>;
    availableFinishedStock(ctx: Context): Promise<number>;
    updateFinishedStock(ctx: Context, qty: number, flag: number): Promise<void>;
    updateRoastedStock(ctx: Context, qty: number, flag: number): Promise<void>;
    updateWastedStock(ctx: Context, qty: number): Promise<void>;
    getWastedStock(ctx: Context): Promise<number>;
    getProcessStock(ctx: Context): Promise<number>;
    updateProcessing(ctx: Context, qty: number): Promise<void>;
    dry(ctx: Context, weightIn: string, weightOut: string): Promise<string>;
    roast(ctx: Context, weightIn: string, weightOut: string): Promise<string>;
    doQA(ctx: Context, weightIn: string, weightOut: string): Promise<string>;
    package(ctx: Context, amtInKg: string): Promise<string>;
    dispatch(ctx: Context, packages: number): Promise<string>;
    getTotalPackages(ctx: Context): Promise<number>;
    updateTotalPackages(ctx: Context, pck: number, flag: number): Promise<void>;
    getWarehouseStock(ctx: Context): Promise<number>;
    updateWarehouseStock(ctx: Context, stk: number): Promise<void>;
}
