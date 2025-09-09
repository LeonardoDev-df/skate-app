import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
export declare class FirebaseConfig {
    private configService;
    constructor(configService: ConfigService);
    getAuth(): import("firebase-admin/lib/auth/auth").Auth;
    getFirestore(): admin.firestore.Firestore;
    getDatabase(): import("firebase-admin/lib/database/database").Database;
    getStorage(): import("firebase-admin/lib/storage/storage").Storage;
}
