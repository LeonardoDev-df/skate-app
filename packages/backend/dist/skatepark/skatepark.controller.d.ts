import { SkateparkService } from './skatepark.service';
export declare class SkateparkController {
    private skateparkService;
    constructor(skateparkService: SkateparkService);
    findAll(city?: string): Promise<{
        skateparks: any[];
        count: number;
        timestamp: string;
        error?: undefined;
    } | {
        skateparks: any[];
        count: number;
        error: string;
        timestamp?: undefined;
    }>;
    debug(): Promise<{
        message: string;
        rawData: any[];
        count: number;
        structure: {
            id: any;
            hasSpot: boolean;
            spotLength: any;
            hasBrasilia: boolean;
            brasiliaLength: any;
        }[];
        error?: undefined;
        details?: undefined;
    } | {
        error: string;
        details: any;
        message?: undefined;
        rawData?: undefined;
        count?: undefined;
        structure?: undefined;
    }>;
    findOne(id: string): Promise<{
        skatepark: any;
        timestamp: string;
    }>;
    findByCity(city: string): Promise<{
        skateparks: any[];
        count: number;
        searchTerm: string;
        normalizedSearchTerm: string;
        timestamp: string;
        error?: undefined;
    } | {
        skateparks: any[];
        count: number;
        error: string;
        searchTerm?: undefined;
        normalizedSearchTerm?: undefined;
        timestamp?: undefined;
    }>;
}
