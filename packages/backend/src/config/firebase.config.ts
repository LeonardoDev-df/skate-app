import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseConfig {
  constructor(private configService: ConfigService) {
    if (!admin.apps.length) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
            clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
            privateKey: this.configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\n/g, '\n'),
          }),
          databaseURL: this.configService.get<string>('FIREBASE_DATABASE_URL'),
          storageBucket: this.configService.get<string>('FIREBASE_STORAGE_BUCKET'),
        });
        
        console.log('✅ Firebase inicializado com sucesso!');
        console.log(`📋 Projeto: ${this.configService.get<string>('FIREBASE_PROJECT_ID')}`);
        console.log(`📧 Service Account: ${this.configService.get<string>('FIREBASE_CLIENT_EMAIL')}`);
        
      } catch (error) {
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
}