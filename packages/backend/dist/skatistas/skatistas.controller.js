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
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let SkatistasController = class SkatistasController {
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
    }
    async findAll() {
        try {
            const skatistas = await this.firebaseService.getAllDocuments('Skatistas');
            return {
                skatistas,
                total: skatistas.length
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Erro ao buscar skatistas');
        }
    }
    async findOne(id) {
        try {
            const doc = await this.firebaseService.getDocument('Skatistas', id);
            if (!doc.exists) {
                throw new common_1.NotFoundException('Skatista não encontrado');
            }
            return { id: doc.id, ...doc.data() };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Erro ao buscar skatista');
        }
    }
    async create(createData) {
        try {
            const documentId = createData.uid || `skatista_${Date.now()}`;
            const skatistaData = {
                uid: documentId,
                email: createData.email,
                name: createData.name,
                image: createData.image || 'sk10.jpg',
                invitation: createData.invitation || null,
                spots: createData.spots || [],
                status: createData.status || 'Online',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            await this.firebaseService.createDocument('Skatistas', skatistaData, documentId);
            return {
                message: 'Skatista criado com sucesso',
                id: documentId,
                skatista: skatistaData
            };
        }
        catch (error) {
            console.error('Erro ao criar skatista:', error);
            throw new common_1.BadRequestException('Erro ao criar skatista');
        }
    }
    async update(id, updateData, req) {
        try {
            const requestingUser = req.user.sub;
            if (requestingUser !== id) {
                throw new common_1.BadRequestException('Você só pode atualizar seu próprio perfil');
            }
            const exists = await this.firebaseService.documentExists('Skatistas', id);
            if (!exists) {
                throw new common_1.NotFoundException('Skatista não encontrado');
            }
            const dataToUpdate = {
                ...updateData,
                updatedAt: new Date().toISOString()
            };
            await this.firebaseService.updateDocument('Skatistas', id, dataToUpdate);
            return {
                message: 'Skatista atualizado com sucesso',
                id
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Erro ao atualizar skatista');
        }
    }
    async getSpots(id) {
        try {
            const doc = await this.firebaseService.getDocument('Skatistas', id);
            if (!doc.exists) {
                throw new common_1.NotFoundException('Skatista não encontrado');
            }
            const skatista = doc.data();
            return {
                spots: skatista.spots || [],
                total: skatista.spots?.length || 0
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Erro ao buscar spots do skatista');
        }
    }
    async addSpot(id, spotData, req) {
        try {
            const requestingUser = req.user.sub;
            if (requestingUser !== id) {
                throw new common_1.BadRequestException('Você só pode adicionar spots ao seu próprio perfil');
            }
            const doc = await this.firebaseService.getDocument('Skatistas', id);
            if (!doc.exists) {
                throw new common_1.NotFoundException('Skatista não encontrado');
            }
            const skatista = doc.data();
            const currentSpots = skatista.spots || [];
            const spotExists = currentSpots.some((spot) => {
                const existingPath = spot.path || spot;
                const newPath = spotData.path || spotData;
                return existingPath === newPath;
            });
            if (spotExists) {
                throw new common_1.BadRequestException('Spot já adicionado');
            }
            const newSpots = [...currentSpots, spotData];
            await this.firebaseService.updateDocument('Skatistas', id, {
                spots: newSpots,
                updatedAt: new Date().toISOString()
            });
            return {
                message: 'Spot adicionado com sucesso',
                spots: newSpots
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Erro ao adicionar spot');
        }
    }
    async removeSpot(id, spotIndex, req) {
        try {
            const requestingUser = req.user.sub;
            if (requestingUser !== id) {
                throw new common_1.BadRequestException('Você só pode remover spots do seu próprio perfil');
            }
            const doc = await this.firebaseService.getDocument('Skatistas', id);
            if (!doc.exists) {
                throw new common_1.NotFoundException('Skatista não encontrado');
            }
            const skatista = doc.data();
            const currentSpots = skatista.spots || [];
            const index = parseInt(spotIndex);
            if (index < 0 || index >= currentSpots.length) {
                throw new common_1.BadRequestException('Spot não encontrado');
            }
            const newSpots = currentSpots.filter((_, i) => i !== index);
            await this.firebaseService.updateDocument('Skatistas', id, {
                spots: newSpots,
                updatedAt: new Date().toISOString()
            });
            return {
                message: 'Spot removido com sucesso',
                spots: newSpots
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Erro ao remover spot');
        }
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
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], SkatistasController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(':id/spots'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SkatistasController.prototype, "getSpots", null);
__decorate([
    (0, common_1.Post)(':id/spots'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], SkatistasController.prototype, "addSpot", null);
__decorate([
    (0, common_1.Delete)(':id/spots/:spotIndex'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('spotIndex')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SkatistasController.prototype, "removeSpot", null);
exports.SkatistasController = SkatistasController = __decorate([
    (0, common_1.Controller)('skatistas'),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], SkatistasController);
//# sourceMappingURL=skatistas.controller.js.map