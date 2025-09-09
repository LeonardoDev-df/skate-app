import { FirebaseConfig } from '../config/firebase.config';
import * as admin from 'firebase-admin';
export declare class FirebaseService {
    private firebaseConfig;
    private firestore;
    private auth;
    private storage;
    constructor(firebaseConfig: FirebaseConfig);
    getCollection(collectionName: string): Promise<admin.firestore.CollectionReference<admin.firestore.DocumentData>>;
    getDocument(collectionName: string, docId: string): Promise<admin.firestore.DocumentSnapshot<admin.firestore.DocumentData>>;
    createDocument(collectionName: string, data: any, docId?: string): Promise<admin.firestore.DocumentReference<admin.firestore.DocumentData> | admin.firestore.WriteResult>;
    updateDocument(collectionName: string, docId: string, data: any): Promise<admin.firestore.WriteResult>;
    deleteDocument(collectionName: string, docId: string): Promise<admin.firestore.WriteResult>;
    queryDocuments(collectionName: string, field: string, operator: FirebaseFirestore.WhereFilterOp, value: any): Promise<{
        id: string;
    }[]>;
    getAllDocuments(collectionName: string): Promise<{
        id: string;
    }[]>;
    getDocumentsWithPagination(collectionName: string, limit: number, startAfter?: any): Promise<{
        docs: {
            id: string;
        }[];
        lastDoc: admin.firestore.QueryDocumentSnapshot<admin.firestore.DocumentData>;
        hasMore: boolean;
    }>;
    getDocumentsOrdered(collectionName: string, orderBy: string, direction?: 'asc' | 'desc', limit?: number): Promise<{
        id: string;
    }[]>;
    documentExists(collectionName: string, docId: string): Promise<boolean>;
    countDocuments(collectionName: string): Promise<number>;
    verifyToken(token: string): Promise<import("firebase-admin/lib/auth/token-verifier").DecodedIdToken>;
    getUserByUid(uid: string): Promise<import("firebase-admin/lib/auth/user-record").UserRecord>;
    createUser(userData: admin.auth.CreateRequest): Promise<import("firebase-admin/lib/auth/user-record").UserRecord>;
    updateUser(uid: string, userData: admin.auth.UpdateRequest): Promise<import("firebase-admin/lib/auth/user-record").UserRecord>;
    deleteUser(uid: string): Promise<void>;
    listUsers(maxResults?: number, pageToken?: string): Promise<import("firebase-admin/lib/auth/base-auth").ListUsersResult>;
    userExists(uid: string): Promise<boolean>;
    getBucket(): import("@google-cloud/storage").Bucket;
    uploadFile(filePath: string, destination: string): Promise<import("@google-cloud/storage").UploadResponse>;
    uploadBuffer(buffer: Buffer, destination: string, metadata?: any): Promise<unknown>;
    deleteFile(fileName: string): Promise<[import("teeny-request").Response<any>]>;
    getFileUrl(fileName: string, expiresInMinutes?: number): Promise<string>;
    fileExists(fileName: string): Promise<boolean>;
    listFiles(prefix?: string): Promise<{
        name: string;
        size: any;
        updated: any;
        contentType: any;
    }[]>;
    getFileMetadata(fileName: string): Promise<any>;
}
