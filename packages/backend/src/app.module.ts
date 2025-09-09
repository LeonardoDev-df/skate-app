import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FirebaseModule } from './firebase/firebase.module'; // ✅ Importar

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ✅ IMPORTANTE: Tornar ConfigModule global
      envFilePath: '.env',
    }),
    FirebaseModule, // ✅ Adicionar FirebaseModule no nível raiz
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}