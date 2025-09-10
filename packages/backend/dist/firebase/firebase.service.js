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
var FirebaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseService = void 0;
const common_1 = require("@nestjs/common");
const firebase_config_1 = require("../config/firebase.config");
const admin = require("firebase-admin");
let FirebaseService = FirebaseService_1 = class FirebaseService {
    constructor(firebaseConfig) {
        this.firebaseConfig = firebaseConfig;
        this.logger = new common_1.Logger(FirebaseService_1.name);
        this.firestore = this.firebaseConfig.getFirestore();
        this.auth = this.firebaseConfig.getAuth();
        this.storage = this.firebaseConfig.getStorage();
    }
    get firestoreInstance() {
        return this.firestore;
    }
    async getAllDocuments(collectionName) {
        try {
            const snapshot = await this.firestore.collection(collectionName).get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
        }
        catch (error) {
            this.logger.error(`Erro ao buscar documentos de ${collectionName}:`, error);
            return [];
        }
    }
    async getCollection(collectionName) {
        return this.firestore.collection(collectionName);
    }
    async getDocument(collectionName, docId) {
        return this.firestore.collection(collectionName).doc(docId).get();
    }
    async createDocument(collectionName, data, docId) {
        if (docId) {
            return this.firestore.collection(collectionName).doc(docId).set(data);
        }
        return this.firestore.collection(collectionName).add(data);
    }
    async updateDocument(collectionName, docId, data) {
        return this.firestore.collection(collectionName).doc(docId).update(data);
    }
    async deleteDocument(collectionName, docId) {
        return this.firestore.collection(collectionName).doc(docId).delete();
    }
    async queryDocuments(collectionName, field, operator, value) {
        const snapshot = await this.firestore
            .collection(collectionName)
            .where(field, operator, value)
            .get();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    }
    async getDocumentsWithPagination(collectionName, limit, startAfter) {
        let query = this.firestore.collection(collectionName).limit(limit);
        if (startAfter) {
            query = query.startAfter(startAfter);
        }
        const snapshot = await query.get();
        return {
            docs: snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })),
            lastDoc: snapshot.docs[snapshot.docs.length - 1],
            hasMore: snapshot.docs.length === limit,
        };
    }
    async getDocumentsOrdered(collectionName, orderBy, direction = 'asc', limit) {
        let query = this.firestore.collection(collectionName).orderBy(orderBy, direction);
        if (limit) {
            query = query.limit(limit);
        }
        const snapshot = await query.get();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    }
    async documentExists(collectionName, docId) {
        const doc = await this.firestore.collection(collectionName).doc(docId).get();
        return doc.exists;
    }
    async countDocuments(collectionName) {
        const snapshot = await this.firestore.collection(collectionName).get();
        return snapshot.size;
    }
    async getCollectionData(collectionName, limit = 10) {
        try {
            const snapshot = await this.firestore
                .collection(collectionName)
                .limit(limit)
                .get();
            const data = [];
            snapshot.forEach(doc => {
                data.push({ id: doc.id, ...doc.data() });
            });
            return {
                count: snapshot.size,
                data
            };
        }
        catch (error) {
            this.logger.error(`Erro ao buscar ${collectionName}:`, error);
            return { count: 0, data: [] };
        }
    }
    async verifyToken(token) {
        try {
            return await this.auth.verifyIdToken(token);
        }
        catch (error) {
            this.logger.error('Erro ao verificar token:', error);
            throw error;
        }
    }
    async getUserByUid(uid) {
        return this.auth.getUser(uid);
    }
    async createUser(userData) {
        return this.auth.createUser(userData);
    }
    async updateUser(uid, userData) {
        return this.auth.updateUser(uid, userData);
    }
    async deleteUser(uid) {
        return this.auth.deleteUser(uid);
    }
    async listUsers(maxResults = 1000, pageToken) {
        return this.auth.listUsers(maxResults, pageToken);
    }
    async userExists(uid) {
        try {
            await this.auth.getUser(uid);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async checkRateLimit(uid, action, limit = 10) {
        try {
            const now = Date.now();
            const windowStart = now - (60 * 1000);
            const rateLimitRef = this.firestore
                .collection('rateLimits')
                .doc(`${uid}_${action}`);
            const doc = await rateLimitRef.get();
            if (!doc.exists) {
                await rateLimitRef.set({
                    count: 1,
                    windowStart: now,
                    lastRequest: now
                });
                return true;
            }
            const data = doc.data();
            if (data.windowStart < windowStart) {
                await rateLimitRef.update({
                    count: 1,
                    windowStart: now,
                    lastRequest: now
                });
                return true;
            }
            if (data.count >= limit) {
                return false;
            }
            await rateLimitRef.update({
                count: admin.firestore.FieldValue.increment(1),
                lastRequest: now
            });
            return true;
        }
        catch (error) {
            this.logger.error('Erro no rate limiting:', error);
            return true;
        }
    }
    getBucket() {
        return this.storage.bucket();
    }
    async uploadFile(filePath, destination) {
        return this.storage.bucket().upload(filePath, {
            destination,
        });
    }
    async uploadBuffer(buffer, destination, metadata) {
        const file = this.storage.bucket().file(destination);
        return new Promise((resolve, reject) => {
            const stream = file.createWriteStream({
                metadata: metadata || {},
                resumable: false,
            });
            stream.on('error', reject);
            stream.on('finish', () => {
                resolve({ message: 'Upload successful', fileName: destination });
            });
            stream.end(buffer);
        });
    }
    async deleteFile(fileName) {
        return this.storage.bucket().file(fileName).delete();
    }
    async getFileUrl(fileName, expiresInMinutes = 60) {
        const file = this.storage.bucket().file(fileName);
        const expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + expiresInMinutes);
        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: expirationDate,
        });
        return url;
    }
    async fileExists(fileName) {
        try {
            const [exists] = await this.storage.bucket().file(fileName).exists();
            return exists;
        }
        catch (error) {
            return false;
        }
    }
    async listFiles(prefix) {
        const options = {};
        if (prefix) {
            options.prefix = prefix;
        }
        const [files] = await this.storage.bucket().getFiles(options);
        return files.map(file => ({
            name: file.name,
            size: file.metadata.size,
            updated: file.metadata.updated,
            contentType: file.metadata.contentType,
        }));
    }
    async getFileMetadata(fileName) {
        const file = this.storage.bucket().file(fileName);
        const [metadata] = await file.getMetadata();
        return metadata;
    }
};
exports.FirebaseService = FirebaseService;
exports.FirebaseService = FirebaseService = FirebaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_config_1.FirebaseConfig])
], FirebaseService);
//# sourceMappingURL=firebase.service.js.map