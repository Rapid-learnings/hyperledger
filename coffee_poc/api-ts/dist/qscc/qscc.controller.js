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
exports.QsccController = void 0;
const common_1 = require("@nestjs/common");
const qscc_service_1 = require("./qscc.service");
let QsccController = class QsccController {
    constructor(queryObj) {
        this.queryObj = queryObj;
    }
    async queryQscc(req, res) {
        try {
            console.log('==================== QUERY BY CHAINCODE ==================');
            let channelName = req.params.channelName;
            let chaincodeName = req.params.chaincodeName;
            console.log(`chaincode name is :${chaincodeName}`);
            let args = req.query.args;
            let fcn = req.query.fcn;
            console.log('channelName : ' + channelName);
            console.log('chaincodeName : ' + chaincodeName);
            console.log('fcn : ' + fcn);
            console.log('args : ' + args);
            if (!chaincodeName) {
                throw new Error('Chaincode name missing');
            }
            if (!channelName) {
                throw new Error('Channel name missing');
            }
            if (!fcn) {
                throw new Error('Function name missing');
            }
            if (!args) {
                throw new Error('Arguments are missing missing');
            }
            let response_payload = await this.queryObj.qscc(channelName, chaincodeName, args, fcn, req.query.username, req.query.orgname);
            res.send(response_payload);
        }
        catch (error) {
            const response_payload = {
                result: null,
                error: error.name,
                errorData: error.message,
            };
            res.send(response_payload);
        }
    }
};
__decorate([
    (0, common_1.Get)('/channels/:channelName/chaincodes/:chaincodeName'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], QsccController.prototype, "queryQscc", null);
QsccController = __decorate([
    (0, common_1.Controller)('qscc'),
    __metadata("design:paramtypes", [qscc_service_1.QsccService])
], QsccController);
exports.QsccController = QsccController;
//# sourceMappingURL=qscc.controller.js.map