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
exports.SkatistasController = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../firebase/firebase.service");
let SkatistasController = class SkatistasController {
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
    }
    async findAll() {
        const collection = await this.firebaseService.getCollection('Skatistas');
        const snapshot = await collection.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    async findOne(id) {
        const doc = await this.firebaseService.getDocument('Skatistas', id);
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        }
        return null;
    }
    async create(createData) {
        return this.firebaseService.createDocument('Skatistas', createData);
    }
};
exports.SkatistasController = SkatistasController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SkatistasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SkatistasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SkatistasController.prototype, "create", null);
exports.SkatistasController = SkatistasController = __decorate([
    (0, common_1.Controller)('skatistas'),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], SkatistasController);
//# sourceMappingURL=skatistas.controller.js.map