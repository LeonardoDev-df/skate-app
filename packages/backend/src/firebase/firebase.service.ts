import { Injectable, Logger } from '@nestjs/common';
import { FirebaseConfig } from '../config/firebase.config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);
  private firestore: admin.firestore.Firestore;
  private auth: admin.auth.Auth;
  private storage: admin.storage.Storage;

  constructor(private firebaseConfig: FirebaseConfig) {
    this.firestore = this.firebaseConfig.getFirestore();
    this.auth = this.firebaseConfig.getAuth();
    this.storage = this.firebaseConfig.getStorage();
  }

  // ✅ Getter público para compatibilidade
  get firestoreInstance() {
    return this.firestore;
  }

  // ✅ Método getAllDocuments com tipagem melhorada
  async getAllDocuments(collectionName: string): Promise<any[]> {
    try {
      const snapshot = await this.firestore.collection(collectionName).get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      this.logger.error(`Erro ao buscar documentos de ${collectionName}:`, error);
      return [];
    }
  }

  // ... resto dos métodos permanecem iguais
  async getCollection(collectionName: string) {
    return this.firestore.collection(collectionName);
  }

  async getDocument(collectionName: string, docId: string) {
    return this.firestore.collection(collectionName).doc(docId).get();
  }

  async createDocument(collectionName: string, data: any, docId?: string) {
    if (docId) {
      return this.firestore.collection(collectionName).doc(docId).set(data);
    }
    return this.firestore.collection(collectionName).add(data);
  }

  async updateDocument(collectionName: string, docId: string, data: any) {
    return this.firestore.collection(collectionName).doc(docId).update(data);
  }

  async deleteDocument(collectionName: string, docId: string) {
    return this.firestore.collection(collectionName).doc(docId).delete();
  }

  async queryDocuments(collectionName: string, field: string, operator: FirebaseFirestore.WhereFilterOp, value: any) {
    const snapshot = await this.firestore
      .collection(collectionName)
      .where(field, operator, value)
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async getDocumentsWithPagination(collectionName: string, limit: number, startAfter?: any) {
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

  async getDocumentsOrdered(collectionName: string, orderBy: string, direction: 'asc' | 'desc' = 'asc', limit?: number) {
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

  async documentExists(collectionName: string, docId: string): Promise<boolean> {
    const doc = await this.firestore.collection(collectionName).doc(docId).get();
    return doc.exists;
  }

  async countDocuments(collectionName: string): Promise<number> {
    const snapshot = await this.firestore.collection(collectionName).get();
    return snapshot.size;
  }

  async getCollectionData(collectionName: string, limit: number = 10) {
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
    } catch (error) {
      this.logger.error(`Erro ao buscar ${collectionName}:`, error);
      return { count: 0, data: [] };
    }
  }

  // Métodos para Auth
  async verifyToken(token: string) {
    try {
      return await this.auth.verifyIdToken(token);
    } catch (error) {
      this.logger.error('Erro ao verificar token:', error);
      throw error;
    }
  }

  async getUserByUid(uid: string) {
    return this.auth.getUser(uid);
  }

  async createUser(userData: admin.auth.CreateRequest) {
    return this.auth.createUser(userData);
  }

  async updateUser(uid: string, userData: admin.auth.UpdateRequest) {
    return this.auth.updateUser(uid, userData);
  }

  async deleteUser(uid: string) {
    return this.auth.deleteUser(uid);
  }

  async listUsers(maxResults: number = 1000, pageToken?: string) {
    return this.auth.listUsers(maxResults, pageToken);
  }

  async userExists(uid: string): Promise<boolean> {
    try {
      await this.auth.getUser(uid);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Rate limiting helper
  async checkRateLimit(uid: string, action: string, limit: number = 10): Promise<boolean> {
    try {
      const now = Date.now();
      const windowStart = now - (60 * 1000); // 1 minuto

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
        // Nova janela de tempo
        await rateLimitRef.update({
          count: 1,
          windowStart: now,
          lastRequest: now
        });
        return true;
      }

      if (data.count >= limit) {
        return false; // Rate limit excedido
      }

      await rateLimitRef.update({
        count: admin.firestore.FieldValue.increment(1),
        lastRequest: now
      });

      return true;
    } catch (error) {
      this.logger.error('Erro no rate limiting:', error);
      return true; // Em caso de erro, permite a requisição
    }
  }

  // Métodos para Storage permanecem iguais...
  getBucket() {
    return this.storage.bucket();
  }

  async uploadFile(filePath: string, destination: string) {
    return this.storage.bucket().upload(filePath, {
      destination,
    });
  }

  async uploadBuffer(buffer: Buffer, destination: string, metadata?: any) {
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

  async deleteFile(fileName: string) {
    return this.storage.bucket().file(fileName).delete();
  }

  async getFileUrl(fileName: string, expiresInMinutes: number = 60) {
    const file = this.storage.bucket().file(fileName);
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + expiresInMinutes);
    
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: expirationDate,
    });
    return url;
  }

  async fileExists(fileName: string): Promise<boolean> {
    try {
      const [exists] = await this.storage.bucket().file(fileName).exists();
      return exists;
    } catch (error) {
      return false;
    }
  }

  async listFiles(prefix?: string) {
    const options: any = {};
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

  async getFileMetadata(fileName: string) {
    const file = this.storage.bucket().file(fileName);
    const [metadata] = await file.getMetadata();
    return metadata;
  }
}