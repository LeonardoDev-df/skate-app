import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FirebaseService } from '../../firebase/firebase.service';
import { RATE_LIMIT_KEY, RateLimitOptions } from '../decorators/rate-limit.decorator';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private firebaseService: FirebaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rateLimitOptions = this.reflector.getAllAndOverride<RateLimitOptions>(
      RATE_LIMIT_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!rateLimitOptions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return true; // Deixa o AuthGuard lidar com isso
    }

    const userId = user.uid || user.sub;
    const allowed = await this.firebaseService.checkRateLimit(
      userId,
      rateLimitOptions.action,
      rateLimitOptions.limit,
    );

    if (!allowed) {
      throw new HttpException(
        'Muitas tentativas. Tente novamente em 1 minuto.',
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    return true;
  }
}