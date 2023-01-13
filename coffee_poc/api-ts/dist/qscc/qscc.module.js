"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QsccModule = void 0;
const common_1 = require("@nestjs/common");
const helper_service_1 = require("../helper/helper.service");
const qscc_controller_1 = require("./qscc.controller");
const qscc_service_1 = require("./qscc.service");
let QsccModule = class QsccModule {
};
QsccModule = __decorate([
    (0, common_1.Module)({
        controllers: [qscc_controller_1.QsccController],
        providers: [qscc_service_1.QsccService, helper_service_1.HelperService]
    })
], QsccModule);
exports.QsccModule = QsccModule;
//# sourceMappingURL=qscc.module.js.map