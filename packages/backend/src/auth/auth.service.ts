import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FirebaseService } from '../firebase/firebase.service'; // ✅ Correto

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private firebaseService: FirebaseService, // ✅ Correto
  ) {}

  async validateFirebaseToken(idToken: string) {
    try {
      const decodedToken = await this.firebaseService.verifyToken(idToken);
      return decodedToken;
    } catch (error) {
      throw new UnauthorizedException('Token Firebase inválido');
    }
  }

  async login(idToken: string) {
    const firebaseUser = await this.validateFirebaseToken(idToken);
    
    // Buscar dados adicionais do usuário no Firestore
    const userDoc = await this.firebaseService.getDocument('users', firebaseUser.uid);
    const userData = userDoc.exists ? userDoc.data() : {};
    
    const payload = {
      sub: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.name || `${userData.Firstname || ''} ${userData.Secondname || ''}`.trim(),
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.name || `${userData.Firstname || ''} ${userData.Secondname || ''}`.trim(),
        picture: firebaseUser.picture,
        ...userData,
      },
    };
  }

  async validateJwtToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Token JWT inválido');
    }
  }

  async getUserProfile(uid: string) {
    try {
      const userDoc = await this.firebaseService.getDocument('users', uid);

      if (!userDoc.exists) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      return {
        id: userDoc.id,
        ...userDoc.data(),
      };
    } catch (error) {
      throw new UnauthorizedException('Erro ao buscar perfil do usuário');
    }
  }
}