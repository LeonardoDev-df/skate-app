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
exports.SkateparkController = void 0;
const common_1 = require("@nestjs/common");
const skatepark_service_1 = require("./skatepark.service");
let SkateparkController = class SkateparkController {
    constructor(skateparkService) {
        this.skateparkService = skateparkService;
    }
    async findAll(city) {
        if (city) {
            return this.skateparkService.findByCity(city);
        }
        return this.skateparkService.findAll();
    }
    async debug() {
        return this.skateparkService.debugSkateparks();
    }
    async findOne(id) {
        return this.skateparkService.findOne(id);
    }
    async findByCity(city) {
        return this.skateparkService.findByCity(city);
    }
};
exports.SkateparkController = SkateparkController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('city')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SkateparkController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('debug'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SkateparkController.prototype, "debug", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SkateparkController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('city/:city'),
    __param(0, (0, common_1.Param)('city')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SkateparkController.prototype, "findByCity", null);
exports.SkateparkController = SkateparkController = __decorate([
    (0, common_1.Controller)('skateparks'),
    __metadata("design:paramtypes", [skatepark_service_1.SkateparkService])
], SkateparkController);
//# sourceMappingURL=skatepark.controller.js.map