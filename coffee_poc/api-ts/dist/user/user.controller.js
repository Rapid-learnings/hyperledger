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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const user_dto_1 = require("./dto/user.dto/user.dto");
const admin_dto_1 = require("./dto/admin.dto/admin.dto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async registerAdmin(req, adminBody, res) {
        try {
            let org = adminBody.orgName;
            console.log(org);
            await this.userService.enrollAdmin(org);
            res.json({
                message: 'Successfully enrolled admin and imported it into the wallet',
            });
        }
        catch (err) {
            throw err;
        }
    }
    async registerUser(usrBody, res) {
        try {
            let usrname = usrBody.username;
            let orgName = usrBody.orgName;
            console.log(orgName);
            console.log(usrname);
            let resp = await this.userService.registerEnrollUser(usrname, orgName);
            res.json({
                message: 'Successfully enrolled User and imported it into the wallet',
            });
        }
        catch (err) {
            throw err;
        }
    }
};
__decorate([
    (0, common_1.Post)('/admin'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_dto_1.AdminDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "registerAdmin", null);
__decorate([
    (0, common_1.Post)('/user'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UserDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "registerUser", null);
UserController = __decorate([
    (0, common_1.Controller)('register'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map