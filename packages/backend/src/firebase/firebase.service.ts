import { Injectable } from '@nestjs/common';
import { FirebaseConfig } from '../config/firebase.config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private firestore: admin.firestore.Firestore;
  private auth: admin.auth.Auth;
  private storage: admin.storage.Storage;

  constructor(private firebaseConfig: FirebaseConfig) {
    this.firestore = this.firebaseConfig.getFirestore();
    this.auth = this.firebaseConfig.getAuth();
    this.storage = this.firebaseConfig.getStorage();
  }

  // Métodos para Firestore
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

  // ✅ CORRIGIDO: Removido o parâmetro 'data' do método delete()
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

  async getAllDocuments(collectionName: string) {
    const snapshot = await this.firestore.collection(collectionName).get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  // ✅ Método adicional para buscar com paginação
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

  // ✅ Método para buscar com ordenação
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

  // ✅ Método para verificar se documento existe
  async documentExists(collectionName: string, docId: string): Promise<boolean> {
    const doc = await this.firestore.collection(collectionName).doc(docId).get();
    return doc.exists;
  }

  // ✅ Método para contar documentos em uma coleção
  async countDocuments(collectionName: string): Promise<number> {
    const snapshot = await this.firestore.collection(collectionName).get();
    return snapshot.size;
  }

  // Métodos para Auth
  async verifyToken(token: string) {
    return this.auth.verifyIdToken(token);
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

  // ✅ Método para listar usuários com paginação
  async listUsers(maxResults: number = 1000, pageToken?: string) {
    return this.auth.listUsers(maxResults, pageToken);
  }

  // ✅ Método para verificar se usuário existe
  async userExists(uid: string): Promise<boolean> {
    try {
      await this.auth.getUser(uid);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Métodos para Storage
  getBucket() {
    return this.storage.bucket();
  }

  async uploadFile(filePath: string, destination: string) {
    return this.storage.bucket().upload(filePath, {
      destination,
    });
  }

  // ✅ Método para upload de buffer
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

  // ✅ Método para verificar se arquivo existe
  async fileExists(fileName: string): Promise<boolean> {
    try {
      const [exists] = await this.storage.bucket().file(fileName).exists();
      return exists;
    } catch (error) {
      return false;
    }
  }

  // ✅ Método para listar arquivos
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

  // ✅ Método para obter metadados do arquivo
  async getFileMetadata(fileName: string) {
    const file = this.storage.bucket().file(fileName);
    const [metadata] = await file.getMetadata();
    return metadata;
  }
}