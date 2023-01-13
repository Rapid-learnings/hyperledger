"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrccController = void 0;
const common_1 = require("@nestjs/common");
const order_dto_1 = require("./dto/order.dto");
const wrcc_service_1 = require("./wrcc.service");
let WrccController = class WrccController {
    constructor(wr) {
        this.wr = wr;
    }
    async initialize(res) {
        try {
            let txId = await this.wr.evaluateTx('whs-rtlr-channel', 'wrcc', 'initialize', 'user202', 'bigbazar');
            res.json({
                message: `Chaincode wrcc initialized & Transaction ID : ${txId}`,
            });
        }
        catch (err) {
            throw err;
        }
    }
    async returnWarehouseSTockAccordingTomwCC(res) {
        try {
            let wStock = await this.wr.evaluateTx('whs-rtlr-channel', 'wrcc', 'returnWarehouseSTockAccordingTomwCC', 'user404', 'tatastore');
            res.json(wStock);
        }
        catch (err) {
            throw err;
        }
    }
    async getWareHouseBalance(res) {
        try {
            let wBal = await this.wr.evaluateTx('whs-rtlr-channel', 'wrcc', 'getWareHouseBalance', 'user202', 'bigbazar');
            res.json(wBal);
        }
        catch (err) {
            throw err;
        }
    }
    async getRetailerBalance(res) {
        try {
            let bal = await this.wr.evaluateTx('whs-rtlr-channel', 'wrcc', 'getRetailerBalance', 'user202', 'bigbazar');
            res.json({ message: `Retailer Balance = ${bal}` });
        }
        catch (err) {
            throw err;
        }
    }
    async getRetailerStock(res) {
        try {
            let bal = await this.wr.evaluateTx('whs-rtlr-channel', 'wrcc', 'getRetailerStock', 'user202', 'bigbazar');
            res.json({ message: `Retailer Stock = ${bal}` });
        }
        catch (err) {
            throw err;
        }
    }
    async updateStatusToInTransit(res, req) {
        try {
            let orderNo = req.params.orderNumber;
            let txId = await this.wr.orderInTransit('whs-rtlr-channel', 'wrcc', 'updateStatusToInTransit', orderNo, 'user202', 'bigbazar');
            res.json({
                message: `Retailer Order Status Changed To In-Transit & Tx ID : ${txId}`,
            });
        }
        catch (err) {
            throw err;
        }
    }
    async placeOrder(body, res) {
        try {
            let args = [];
            args.push(body.quantity);
            args.push(body.country);
            args.push(body.state);
            console.log(args);
            let result = await this.wr.placeOrder('whs-rtlr-channel', 'wrcc', 'placeOrder', args, 'user202', 'bigbazar');
            console.log(result);
            res.json({
                message: `Order Number for Reatailer =  ${result.result.orderNumber} & Tx ID : ${result.txId}`,
            });
        }
        catch (err) {
            throw err;
        }
    }
    async updateStatusToDelivered(res, req) {
        try {
            let orderNo = req.params.orderNumber;
            let status = await this.wr.orderDelivered('whs-rtlr-channel', 'wrcc', 'updateStatusToDelivered', orderNo, 'user202', 'bigbazar');
            res.json({ message: 'Retailer Order Status Changed To Delivered' });
        }
        catch (err) {
            throw err;
        }
    }
    async getOrderDetails(res, req) {
        try {
            let orderNo = req.params.orderNumber;
            let orderObj = await this.wr.getOrderDetails('whs-rtlr-channel', 'wrcc', 'getOrderDetails', orderNo, 'user202', 'bigbazar');
            res.json({ message: orderObj });
        }
        catch (err) {
            throw err;
        }
    }
};
__decorate([
    (0, common_1.Get)('/init-wrcc'),
    __param(0, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WrccController.prototype, "initialize", null);
__decorate([
    (0, common_1.Get)('/warehouse/stock'),
    __param(0, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WrccController.prototype, "returnWarehouseSTockAccordingTomwCC", null);
__decorate([
    (0, common_1.Get)('/warehouse/balance'),
    __param(0, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WrccController.prototype, "getWareHouseBalance", null);
__decorate([
    (0, common_1.Get)('/retailer/balance'),
    __param(0, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WrccController.prototype, "getRetailerBalance", null);
__decorate([
    (0, common_1.Get)('/retailer/stock'),
    __param(0, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WrccController.prototype, "getRetailerStock", null);
__decorate([
    (0, common_1.Post)('/warehouse/order-transit/:orderNumber'),
    __param(0, (0, common_1.Response)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WrccController.prototype, "updateStatusToInTransit", null);
__decorate([
    (0, common_1.Post)('/retailer/place-order'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_dto_1.OrderDto, Object]),
    __metadata("design:returntype", Promise)
], WrccController.prototype, "placeOrder", null);
__decorate([
    (0, common_1.Post)('/warehouse/order-delivered/:orderNumber'),
    __param(0, (0, common_1.Response)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WrccController.prototype, "updateStatusToDelivered", null);
__decorate([
    (0, common_1.Get)('/warehouse/order-details/:orderNumber'),
    __param(0, (0, common_1.Response)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WrccController.prototype, "getOrderDetails", null);
WrccController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [wrcc_service_1.WrccService])
], WrccController);
exports.WrccController = WrccController;
//# sourceMappingURL=wrcc.controller.js.map