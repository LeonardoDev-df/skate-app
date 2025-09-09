import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { FirebaseService } from './firebase/firebase.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async getHealth() {
    try {
      // Testar conexão com Firestore
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
    } catch (error) {
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

  @Get('firebase-test')
  async testFirebase() {
    try {
      // Testar todas as coleções do seu Firebase
      const collections = ['users', 'Skatistas', 'SkatePark', 'Partidas', 'ranking'];
      const results = {};

      for (const collectionName of collections) {
        try {
          const docs = await this.firebaseService.getAllDocuments(collectionName);
          results[collectionName] = {
            count: docs.length,
            sample: docs.slice(0, 2), // Primeiros 2 documentos
          };
        } catch (error) {
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
    } catch (error) {
      return {
        status: 'error',
        message: 'Firebase test failed',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}