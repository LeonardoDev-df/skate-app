import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const userAgent = request.get('User-Agent') || '';
    const user = request.user?.uid || request.user?.sub || 'anonymous';

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const responseTime = Date.now() - now;

        this.logger.log(
          `${method} ${url} ${statusCode} ${responseTime}ms - ${user} - ${ip} - ${userAgent}`,
        );
      }),
    );
  }
}