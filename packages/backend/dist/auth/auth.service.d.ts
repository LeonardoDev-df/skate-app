import { JwtService } from '@nestjs/jwt';
import { FirebaseConfig } from '../config/firebase.config';
export declare class AuthService {
    private jwtService;
    private firebaseConfig;
    constructor(jwtService: JwtService, firebaseConfig: FirebaseConfig);
    validateFirebaseToken(idToken: string): Promise<import("firebase-admin/lib/auth/token-verifier").DecodedIdToken>;
    login(idToken: string): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: any;
            picture: string;
        };
    }>;
}
