import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: {
        idToken: string;
    }): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: any;
            picture: string;
        };
    }>;
    getProfile(req: any): Promise<{
        id: string;
    }>;
    validateToken(req: any): Promise<{
        valid: boolean;
        user: any;
    }>;
}
