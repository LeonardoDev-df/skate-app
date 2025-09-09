import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FirebaseConfig } from '../config/firebase.config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private firebaseConfig: FirebaseConfig,
  ) {}

  async validateFirebaseToken(idToken: string) {
    try {
      const decodedToken = await this.firebaseConfig.getAuth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      throw new UnauthorizedException('Token Firebase inválido');
    }
  }

  async login(idToken: string) {
    const firebaseUser = await this.validateFirebaseToken(idToken);
    
    const payload = {
      sub: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.name,
        picture: firebaseUser.picture,
      },
    };
  }
}