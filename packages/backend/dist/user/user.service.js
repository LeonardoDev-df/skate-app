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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../firebase/firebase.service");
let UserService = class UserService {
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
    }
    async findAll(limit = 10, page = 1) {
        try {
            const offset = (page - 1) * limit;
            const users = await this.firebaseService.getAllDocuments('users');
            const paginatedUsers = users.slice(offset, offset + limit);
            return {
                users: paginatedUsers,
                pagination: {
                    page,
                    limit,
                    total: users.length,
                    totalPages: Math.ceil(users.length / limit)
                }
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Erro ao buscar usuários');
        }
    }
    async findOne(uid) {
        try {
            const userDoc = await this.firebaseService.getDocument('users', uid);
            if (!userDoc.exists) {
                throw new common_1.NotFoundException('Usuário não encontrado');
            }
            return {
                id: userDoc.id,
                ...userDoc.data()
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Erro ao buscar usuário');
        }
    }
    async create(uid, userData) {
        try {
            const exists = await this.firebaseService.documentExists('users', uid);
            if (exists) {
                throw new common_1.BadRequestException('Usuário já existe');
            }
            const userToCreate = {
                ...userData,
                uid,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                role: userData.role || 'user',
                status: 'active'
            };
            await this.firebaseService.createDocument('users', userToCreate, uid);
            return {
                message: 'Usuário criado com sucesso',
                user: userToCreate
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Erro ao criar usuário');
        }
    }
    async update(uid, updateData) {
        try {
            const exists = await this.firebaseService.documentExists('users', uid);
            if (!exists) {
                throw new common_1.NotFoundException('Usuário não encontrado');
            }
            const dataToUpdate = {
                ...updateData,
                updatedAt: new Date().toISOString()
            };
            delete dataToUpdate.uid;
            delete dataToUpdate.createdAt;
            await this.firebaseService.updateDocument('users', uid, dataToUpdate);
            return {
                message: 'Usuário atualizado com sucesso',
                uid
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Erro ao atualizar usuário');
        }
    }
    async delete(uid) {
        try {
            const exists = await this.firebaseService.documentExists('users', uid);
            if (!exists) {
                throw new common_1.NotFoundException('Usuário não encontrado');
            }
            await this.firebaseService.deleteDocument('users', uid);
            return {
                message: 'Usuário deletado com sucesso',
                uid
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Erro ao deletar usuário');
        }
    }
    async isAdmin(uid) {
        try {
            const userDoc = await this.firebaseService.getDocument('users', uid);
            if (!userDoc.exists) {
                return false;
            }
            const userData = userDoc.data();
            return userData?.role === 'admin';
        }
        catch (error) {
            return false;
        }
    }
    async getUserSkateparks(uid) {
        try {
            const skatistaDoc = await this.firebaseService.getDocument('Skatistas', uid);
            if (!skatistaDoc.exists) {
                return { skateparks: [] };
            }
            const skatistaData = skatistaDoc.data();
            const spots = skatistaData?.spots || [];
            return {
                skateparks: spots,
                count: spots.length
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Erro ao buscar skateparks do usuário');
        }
    }
    async addSkatepark(uid, parkId) {
        try {
            const skatistaDoc = await this.firebaseService.getDocument('Skatistas', uid);
            if (!skatistaDoc.exists) {
                throw new common_1.NotFoundException('Skatista não encontrado');
            }
            const skatistaData = skatistaDoc.data();
            const currentSpots = skatistaData?.spots || [];
            const alreadyHas = currentSpots.some((spot) => spot.id === parkId);
            if (alreadyHas) {
                throw new common_1.BadRequestException('Skatepark já adicionado');
            }
            const newSpots = [...currentSpots, { id: parkId, addedAt: new Date().toISOString() }];
            await this.firebaseService.updateDocument('Skatistas', uid, {
                spots: newSpots,
                updatedAt: new Date().toISOString()
            });
            return {
                message: 'Skatepark adicionado com sucesso',
                parkId
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Erro ao adicionar skatepark');
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], UserService);
//# sourceMappingURL=user.service.js.map