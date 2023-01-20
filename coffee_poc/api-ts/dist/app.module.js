"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_module_1 = require("./user/user.module");
const helper_service_1 = require("./helper/helper.service");
const helper_module_1 = require("./helper/helper.module");
const qscc_module_1 = require("./qscc/qscc.module");
const pmcc_module_1 = require("./pmcc/pmcc.module");
const mwcc_module_1 = require("./mwcc/mwcc.module");
const wrcc_service_1 = require("./wrcc/wrcc.service");
const wrcc_controller_1 = require("./wrcc/wrcc.controller");
const wrcc_module_1 = require("./wrcc/wrcc.module");
const mwcc_controller_1 = require("./mwcc/mwcc.controller");
const mwcc_service_1 = require("./mwcc/mwcc.service");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [user_module_1.UserModule, helper_module_1.HelperModule, qscc_module_1.QsccModule, pmcc_module_1.PmccModule, mwcc_module_1.MwccModule, wrcc_module_1.WrccModule],
        controllers: [app_controller_1.AppController, wrcc_controller_1.WrccController, mwcc_controller_1.MwccController],
        providers: [app_service_1.AppService, helper_service_1.HelperService, wrcc_service_1.WrccService, mwcc_service_1.MwccService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map