import { SetMetadata } from '@nestjs/common';

export const RATE_LIMIT_KEY = 'rateLimit';

export interface RateLimitOptions {
  action: string;
  limit: number;
}

export const RateLimit = (options: RateLimitOptions) => 
  SetMetadata(RATE_LIMIT_KEY, options);