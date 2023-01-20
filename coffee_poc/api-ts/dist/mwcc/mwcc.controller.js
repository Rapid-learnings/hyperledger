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
exports.MwccController = void 0;
const common_1 = require("@nestjs/common");
const mwcc_service_1 = require("./mwcc.service");
const mw_dto_1 = require("./dto/mw.dto");
let MwccController = class MwccController {
    constructor(invokeObjMW) {
        this.invokeObjMW = invokeObjMW;
    }
    async initialize(res) {
        try {
            let txId = await this.invokeObjMW.evaluateTx('mfd-whs-channel', 'mwcc', 'initialize', 'user404', 'tatastore');
            res.json({ message: `MWCC Initialized & Transaction ID : ${txId}` });
        }
        catch (err) {
            throw err;
        }
    }
    async returnRawStockAccordingToPMCC(res) {
        try {
            let message = await this.invokeObjMW.evaluateTx('mfd-whs-channel', 'mwcc', 'returnRawStockAccordingToPMCC', 'user101', 'tata');
            res.json({ message: `manufacturer stock is ${message} Kg` });
        }
        catch (err) {
            throw err;
        }
    }
    async availableDriedStock(res) {
        try {
            let message = await this.invokeObjMW.evaluateTx('mfd-whs-channel', 'mwcc', 'availableDriedStock', 'user101', 'tata');
            res.json({ message: `manufacturer dried stock is ${message} Kg` });
        }
        catch (err) {
            throw err;
        }
    }
    async availableRoastedStock(res) {
        try {
            let message = await this.invokeObjMW.evaluateTx('mfd-whs-channel', 'mwcc', 'availableRoastedStock', 'user101', 'tata');
            res.json({ message: `manufacturer roasted stock is ${message} Kg` });
        }
        catch (err) {
            throw err;
        }
    }
    async availableFinishedStock(res) {
        try {
            let message = await this.invokeObjMW.evaluateTx('mfd-whs-channel', 'mwcc', 'availableFinishedStock', 'user101', 'tata');
            res.json({ message: `manufacturer finished stock is ${message} Kg` });
        }
        catch (err) {
            throw err;
        }
    }
    async getWastedStock(res) {
        try {
            let message = await this.invokeObjMW.evaluateTx('mfd-whs-channel', 'mwcc', 'getWastedStock', 'user101', 'tata');
            res.json({ message: `manufacturer wasted stock is ${message} Kg` });
        }
        catch (err) {
            throw err;
        }
    }
    async getTotalPackages(res) {
        try {
            let message = await this.invokeObjMW.evaluateTx('mfd-whs-channel', 'mwcc', 'getTotalPackages', 'user101', 'tata');
            res.json({ message: `manufacturer total packages is ${message}` });
        }
        catch (err) {
            throw err;
        }
    }
    async dry(body, res) {
        try {
            let username = body.username;
            let org_name = body.org_name;
            let args = body.args;
            let txId = await this.invokeObjMW.dry('mfd-whs-channel', 'mwcc', args, username, org_name);
            res.json({
                message: `${args[1]} Kg of raw stock dried & Tx Id : ${txId}`,
            });
        }
        catch (err) {
            throw err;
        }
    }
    async roast(body, res) {
        try {
            let username = body.username;
            let org_name = body.org_name;
            let args = body.args;
            let txId = await this.invokeObjMW.roast('mfd-whs-channel', 'mwcc', args, username, org_name);
            res.json({
                message: `${args[1]} Kg of raw stock roasted & Tx ID : ${txId}`,
            });
        }
        catch (err) {
            throw err;
        }
    }
    async doQA(body, res) {
        try {
            let username = body.username;
            let org_name = body.org_name;
            let args = body.args;
            let txId = await this.invokeObjMW.doQA('mfd-whs-channel', 'mwcc', args, username, org_name);
            res.json({
                message: `${args[1]} Kg of raw stock quality checked & Tx ID : ${txId}`,
            });
        }
        catch (err) {
            throw err;
        }
    }
    async package(body, res) {
        try {
            let username = body.username;
            let org_name = body.org_name;
            let args = body.args;
            let txId = await this.invokeObjMW.package('mfd-whs-channel', 'mwcc', args, username, org_name);
            res.json({
                message: `${args[0]} Kg of finished stock is packaged & Tx ID : ${txId}`,
            });
        }
        catch (err) {
            throw err;
        }
    }
    async dispatch(res, body) {
        try {
            let username = body.username;
            let org_name = body.org_name;
            let args = body.args;
            let txId = await this.invokeObjMW.dispatch('mfd-whs-channel', 'mwcc', args, username, org_name);
            res.json({
                message: `${args[0]} packages are dispatched & Tx ID : ${txId}`,
            });
        }
        catch (err) {
            throw err;
        }
    }
};
__decorate([
    (0, common_1.Get)('/init-mwcc'),
    __param(0, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MwccController.prototype, "initialize", null);
__decorate([
    (0, common_1.Get)('/manufacturer/raw-stock-from-pmcc'),
    __param(0, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MwccController.prototype, "returnRawStockAccordingToPMCC", null);
__decorate([
    (0, common_1.Get)('/manufacturer/dried-stock'),
    __param(0, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MwccController.prototype, "availableDriedStock", null);
__decorate([
    (0, common_1.Get)('/manufacturer/roasted-stock'),
    __param(0, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MwccController.prototype, "availableRoastedStock", null);
__decorate([
    (0, common_1.Get)('/manufacturer/finished-stock'),
    __param(0, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MwccController.prototype, "availableFinishedStock", null);
__decorate([
    (0, common_1.Get)('/manufacturer/wasted-stock'),
    __param(0, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MwccController.prototype, "getWastedStock", null);
__decorate([
    (0, common_1.Get)('/manufacturer/total-packages'),
    __param(0, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MwccController.prototype, "getTotalPackages", null);
__decorate([
    (0, common_1.Post)('/manufacturer/dry'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mw_dto_1.mwDto, Object]),
    __metadata("design:returntype", Promise)
], MwccController.prototype, "dry", null);
__decorate([
    (0, common_1.Post)('/manufacturer/roast'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mw_dto_1.mwDto, Object]),
    __metadata("design:returntype", Promise)
], MwccController.prototype, "roast", null);
__decorate([
    (0, common_1.Post)('/manufacturer/doQA'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mw_dto_1.mwDto, Object]),
    __metadata("design:returntype", Promise)
], MwccController.prototype, "doQA", null);
__decorate([
    (0, common_1.Post)('/manufacturer/package'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mw_dto_1.mwDto, Object]),
    __metadata("design:returntype", Promise)
], MwccController.prototype, "package", null);
__decorate([
    (0, common_1.Post)('/manufacturer/dispatch'),
    __param(0, (0, common_1.Response)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, mw_dto_1.mwDto]),
    __metadata("design:returntype", Promise)
], MwccController.prototype, "dispatch", null);
MwccController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [mwcc_service_1.MwccService])
], MwccController);
exports.MwccController = MwccController;
//# sourceMappingURL=mwcc.controller.js.map