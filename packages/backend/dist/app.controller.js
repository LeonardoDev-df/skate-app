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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const firebase_service_1 = require("./firebase/firebase.service");
let AppController = class AppController {
    constructor(appService, firebaseService) {
        this.appService = appService;
        this.firebaseService = firebaseService;
    }
    getHello() {
        return this.appService.getHello();
    }
    async getHealth() {
        try {
            const usersCollection = await this.firebaseService.getCollection('users');
            const snapshot = await usersCollection.limit(1).get();
            return {
                status: 'ok',
                message: 'Backend is running',
                firebase: {
                    connected: true,
                    collections: {
                        users: snapshot.size,
                    }
                },
                timestamp: new Date().toISOString(),
                version: '1.0.0',
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: 'Backend is running but Firebase has issues',
                firebase: {
                    connected: false,
                    error: error.message,
                },
                timestamp: new Date().toISOString(),
                version: '1.0.0',
            };
        }
    }
    async testFirebase() {
        try {
            const collections = ['users', 'Skatistas', 'SkatePark', 'Partidas', 'ranking'];
            const results = {};
            for (const collectionName of collections) {
                try {
                    const docs = await this.firebaseService.getAllDocuments(collectionName);
                    results[collectionName] = {
                        count: docs.length,
                        sample: docs.slice(0, 2),
                    };
                }
                catch (error) {
                    results[collectionName] = {
                        error: error.message,
                    };
                }
            }
            return {
                status: 'success',
                message: 'Firebase connection test',
                collections: results,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: 'Firebase test failed',
                error: error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Get)('firebase-test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "testFirebase", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        firebase_service_1.FirebaseService])
], AppController);
//# sourceMappingURL=app.controller.js.map