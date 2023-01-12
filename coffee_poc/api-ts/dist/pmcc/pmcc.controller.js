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
exports.PmccController = void 0;
const common_1 = require("@nestjs/common");
const pmcc_service_1 = require("./pmcc.service");
const order_dto_1 = require("./dto/order.dto");
let PmccController = class PmccController {
    constructor(invokeObj) {
        this.invokeObj = invokeObj;
    }
    async getProducerStorage(res) {
        try {
            let message = await this.invokeObj.evaluateTx("mfd-prd-channel", "pmcc", "availableStock", "user101", "tata");
            res.json({ message: `Storage Of Producer = ${message}` });
        }
        catch (err) {
            throw err;
        }
    }
    async getManufacturerStock(res) {
        try {
            let message = await this.invokeObj.evaluateTx("mfd-prd-channel", "pmcc", "getManufacturerStock", "user101", "tata");
            console.log(message);
            res.json({ message: `Manufacturer Stock = ${message}` });
        }
        catch (err) {
            throw err;
        }
    }
    async getManufacturerFunds(res) {
        try {
            let message = await this.invokeObj.evaluateTx("mfd-prd-channel", "pmcc", "getManufacturerFunds", "user101", "tata");
            res.json({ message: `Manufacturer Funds = ${message}` });
        }
        catch (err) {
            throw err;
        }
    }
    async getOrderDetails(req, res) {
        try {
            let orderNumber = req.params.orderNumber;
            console.log(typeof orderNumber);
            let message = await this.invokeObj.getOrderDetails("mfd-prd-channel", "pmcc", "getOrderDetails", orderNumber, "user101", "tata");
            res.json({ message: `Order Details For Manufacturer = ${message}` });
        }
        catch (err) {
            throw err;
        }
    }
    async initPmcc(req, res) {
        try {
            let txId = await this.invokeObj.evaluateTx("mfd-prd-channel", "pmcc", "init", "user101", "tata");
            res.json({ message: `Chaincode pmcc initialized with Transaction ID: ${txId}` });
        }
        catch (err) {
            throw err;
        }
    }
    async placeOrder(req, order, res) {
        try {
            let args = [];
            args.push(order.quantity);
            args.push(order.city);
            args.push(order.state);
            console.log(args);
            let result = await this.invokeObj.placeOrder("mfd-prd-channel", "pmcc", "placeOrder", args, "user101", "tata");
            res.json({ message: `Order Number & Transaction ID for Manufacturer =  ${result}` });
        }
        catch (err) {
            throw err;
        }
    }
    async updateStatusToInTransit(req, res) {
        try {
            let orderNo = req.params.orderNumber;
            let result = await this.invokeObj.orderInTransit("mfd-prd-channel", "pmcc", "updateStatusToInTransit", orderNo, "user101", "tata");
            res.json({ message: `Order Status Changed To In-Transit & Tx Id = ${result}` });
        }
        catch (err) {
            throw err;
        }
    }
    async updateStatusToDelivered(req, res) {
        try {
            let orderNo = req.params.orderNumber;
            let result = await this.invokeObj.orderInTransit("mfd-prd-channel", "pmcc", "updateStatusToDelivered", orderNo, "user101", "tata");
            res.json({ message: `Order Status Changed To Delivered & Tx ID : ${result}` });
        }
        catch (err) {
            throw err;
        }
    }
};
__decorate([
    (0, common_1.Get)("/producer/storage"),
    __param(0, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PmccController.prototype, "getProducerStorage", null);
__decorate([
    (0, common_1.Get)("/manufacturer-stock"),
    __param(0, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PmccController.prototype, "getManufacturerStock", null);
__decorate([
    (0, common_1.Get)("/manufacturer-fund"),
    __param(0, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PmccController.prototype, "getManufacturerFunds", null);
__decorate([
    (0, common_1.Get)("/manufacturer/order-details/:orderNumber"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PmccController.prototype, "getOrderDetails", null);
__decorate([
    (0, common_1.Get)("/init-pmcc"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PmccController.prototype, "initPmcc", null);
__decorate([
    (0, common_1.Post)("/manufacture/place-order"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, order_dto_1.OrderDto, Object]),
    __metadata("design:returntype", Promise)
], PmccController.prototype, "placeOrder", null);
__decorate([
    (0, common_1.Post)("/production/transit/:orderNumber"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PmccController.prototype, "updateStatusToInTransit", null);
__decorate([
    (0, common_1.Post)("/production/delivered/:orderNumber"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PmccController.prototype, "updateStatusToDelivered", null);
PmccController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [pmcc_service_1.PmccService])
], PmccController);
exports.PmccController = PmccController;
//# sourceMappingURL=pmcc.controller.js.map