import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FirebaseService } from '../../firebase/firebase.service';
export declare class RateLimitGuard implements CanActivate {
    private reflector;
    private firebaseService;
    constructor(reflector: Reflector, firebaseService: FirebaseService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
