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
exports.FirebaseConfig = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const admin = require("firebase-admin");
let FirebaseConfig = class FirebaseConfig {
    constructor(configService) {
        this.configService = configService;
        if (!admin.apps.length) {
            try {
                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: this.configService.get('FIREBASE_PROJECT_ID'),
                        clientEmail: this.configService.get('FIREBASE_CLIENT_EMAIL'),
                        privateKey: this.configService.get('FIREBASE_PRIVATE_KEY')?.replace(/\n/g, '\n'),
                    }),
                    databaseURL: this.configService.get('FIREBASE_DATABASE_URL'),
                    storageBucket: this.configService.get('FIREBASE_STORAGE_BUCKET'),
                });
                console.log('✅ Firebase inicializado com sucesso!');
                console.log(`📋 Projeto: ${this.configService.get('FIREBASE_PROJECT_ID')}`);
                console.log(`📧 Service Account: ${this.configService.get('FIREBASE_CLIENT_EMAIL')}`);
            }
            catch (error) {
                console.error('❌ Erro ao inicializar Firebase:', error.message);
                throw error;
            }
        }
    }
    getAuth() {
        return admin.auth();
    }
    getFirestore() {
        return admin.firestore();
    }
    getDatabase() {
        return admin.database();
    }
    getStorage() {
        return admin.storage();
    }
};
exports.FirebaseConfig = FirebaseConfig;
exports.FirebaseConfig = FirebaseConfig = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FirebaseConfig);
//# sourceMappingURL=firebase.config.js.map