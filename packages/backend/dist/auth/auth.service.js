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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const firebase_service_1 = require("../firebase/firebase.service");
let AuthService = class AuthService {
    constructor(jwtService, firebaseService) {
        this.jwtService = jwtService;
        this.firebaseService = firebaseService;
    }
    async validateFirebaseToken(idToken) {
        try {
            const decodedToken = await this.firebaseService.verifyToken(idToken);
            return decodedToken;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Token Firebase inválido');
        }
    }
    async login(idToken) {
        const firebaseUser = await this.validateFirebaseToken(idToken);
        const userDoc = await this.firebaseService.getDocument('users', firebaseUser.uid);
        const userData = userDoc.exists ? userDoc.data() : {};
        const payload = {
            sub: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.name || `${userData.Firstname || ''} ${userData.Secondname || ''}`.trim(),
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.name || `${userData.Firstname || ''} ${userData.Secondname || ''}`.trim(),
                picture: firebaseUser.picture,
                ...userData,
            },
        };
    }
    async validateJwtToken(token) {
        try {
            return this.jwtService.verify(token);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Token JWT inválido');
        }
    }
    async getUserProfile(uid) {
        try {
            const userDoc = await this.firebaseService.getDocument('users', uid);
            if (!userDoc.exists) {
                throw new common_1.UnauthorizedException('Usuário não encontrado');
            }
            return {
                id: userDoc.id,
                ...userDoc.data(),
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Erro ao buscar perfil do usuário');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        firebase_service_1.FirebaseService])
], AuthService);
//# sourceMappingURL=auth.service.js.map