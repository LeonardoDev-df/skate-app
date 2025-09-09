import { JwtService } from '@nestjs/jwt';
import { FirebaseService } from '../firebase/firebase.service';
export declare class AuthService {
    private jwtService;
    private firebaseService;
    constructor(jwtService: JwtService, firebaseService: FirebaseService);
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
    validateJwtToken(token: string): Promise<any>;
    getUserProfile(uid: string): Promise<{
        id: string;
    }>;
}
