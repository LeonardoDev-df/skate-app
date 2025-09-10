export declare const RATE_LIMIT_KEY = "rateLimit";
export interface RateLimitOptions {
    action: string;
    limit: number;
}
export declare const RateLimit: (options: RateLimitOptions) => import("@nestjs/common").CustomDecorator<string>;
