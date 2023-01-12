"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MwccModule = void 0;
const common_1 = require("@nestjs/common");
const helper_service_1 = require("../helper/helper.service");
const mwcc_controller_1 = require("./mwcc.controller");
const mwcc_service_1 = require("./mwcc.service");
let MwccModule = class MwccModule {
};
MwccModule = __decorate([
    (0, common_1.Module)({
        controllers: [mwcc_controller_1.MwccController],
        providers: [mwcc_service_1.MwccService, helper_service_1.HelperService]
    })
], MwccModule);
exports.MwccModule = MwccModule;
//# sourceMappingURL=mwcc.module.js.map