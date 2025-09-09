import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { AuthModule } from '../auth/auth.module'; // ✅ Importar AuthModule completo

@Module({
  imports: [
    FirebaseModule, 
    AuthModule, // ✅ Isso traz o JwtService e JwtAuthGuard
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}