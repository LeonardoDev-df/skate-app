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
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const rate_limit_guard_1 = require("../common/guards/rate-limit.guard");
const rate_limit_decorator_1 = require("../common/decorators/rate-limit.decorator");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async findAll(req, limit, page) {
        const user = req.user;
        const isAdmin = await this.userService.isAdmin(user.sub);
        if (!isAdmin) {
            throw new common_1.ForbiddenException('Apenas administradores podem listar todos os usuários');
        }
        const limitNum = limit ? parseInt(limit) : 10;
        const pageNum = page ? parseInt(page) : 1;
        return this.userService.findAll(limitNum, pageNum);
    }
    async getMyProfile(req) {
        return this.userService.findOne(req.user.sub);
    }
    async findOne(uid, req) {
        const requestingUser = req.user.sub;
        const isAdmin = await this.userService.isAdmin(requestingUser);
        if (requestingUser !== uid && !isAdmin) {
            throw new common_1.ForbiddenException('Você só pode acessar seu próprio perfil');
        }
        return this.userService.findOne(uid);
    }
    async create(createUserDto, req) {
        const { uid, ...userData } = createUserDto;
        const requestingUser = req.user.sub;
        const isAdmin = await this.userService.isAdmin(requestingUser);
        if (uid !== requestingUser && !isAdmin) {
            throw new common_1.ForbiddenException('Você só pode criar seu próprio perfil');
        }
        return this.userService.create(uid, userData);
    }
    async update(uid, updateUserDto, req) {
        const requestingUser = req.user.sub;
        const isAdmin = await this.userService.isAdmin(requestingUser);
        if (requestingUser !== uid && !isAdmin) {
            throw new common_1.ForbiddenException('Você só pode atualizar seu próprio perfil');
        }
        return this.userService.update(uid, updateUserDto);
    }
    async delete(uid, req) {
        const requestingUser = req.user.sub;
        const isAdmin = await this.userService.isAdmin(requestingUser);
        if (requestingUser !== uid && !isAdmin) {
            throw new common_1.ForbiddenException('Você só pode deletar seu próprio perfil');
        }
        return this.userService.delete(uid);
    }
    async getUserSkateparks(uid, req) {
        const requestingUser = req.user.sub;
        const isAdmin = await this.userService.isAdmin(requestingUser);
        if (requestingUser !== uid && !isAdmin) {
            throw new common_1.ForbiddenException('Acesso negado');
        }
        return this.userService.getUserSkateparks(uid);
    }
    async addSkatepark(uid, parkId, req) {
        const requestingUser = req.user.sub;
        if (requestingUser !== uid) {
            throw new common_1.ForbiddenException('Você só pode adicionar skateparks ao seu próprio perfil');
        }
        return this.userService.addSkatepark(uid, parkId);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(),
    (0, rate_limit_decorator_1.RateLimit)({ action: 'list_users', limit: 20 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, rate_limit_decorator_1.RateLimit)({ action: 'get_profile', limit: 30 }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Get)(':uid'),
    (0, rate_limit_decorator_1.RateLimit)({ action: 'get_user', limit: 30 }),
    __param(0, (0, common_1.Param)('uid')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, rate_limit_decorator_1.RateLimit)({ action: 'create_user', limit: 5 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':uid'),
    (0, rate_limit_decorator_1.RateLimit)({ action: 'update_user', limit: 10 }),
    __param(0, (0, common_1.Param)('uid')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':uid'),
    (0, rate_limit_decorator_1.RateLimit)({ action: 'delete_user', limit: 3 }),
    __param(0, (0, common_1.Param)('uid')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)(':uid/skateparks'),
    (0, rate_limit_decorator_1.RateLimit)({ action: 'get_user_skateparks', limit: 20 }),
    __param(0, (0, common_1.Param)('uid')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserSkateparks", null);
__decorate([
    (0, common_1.Post)(':uid/skateparks/:parkId'),
    (0, rate_limit_decorator_1.RateLimit)({ action: 'add_skatepark', limit: 10 }),
    __param(0, (0, common_1.Param)('uid')),
    __param(1, (0, common_1.Param)('parkId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addSkatepark", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rate_limit_guard_1.RateLimitGuard),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map