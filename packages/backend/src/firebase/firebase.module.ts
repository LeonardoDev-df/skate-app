import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // ✅ Adicionar ConfigModule
import { FirebaseConfig } from '../config/firebase.config';
import { FirebaseService } from './firebase.service';

@Module({
  imports: [ConfigModule], // ✅ IMPORTANTE: FirebaseConfig precisa do ConfigModule
  providers: [FirebaseConfig, FirebaseService],
  exports: [FirebaseService, FirebaseConfig], // ✅ Exportar ambos
})
export class FirebaseModule {}