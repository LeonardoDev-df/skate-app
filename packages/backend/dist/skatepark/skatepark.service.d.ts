import { FirebaseService } from '../firebase/firebase.service';
export declare class SkateparkService {
    private firebaseService;
    private readonly logger;
    constructor(firebaseService: FirebaseService);
    findAll(): Promise<{
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
    private extractCoordinatesFromUrl;
    private getCoordinatesByName;
    private getDefaultCoordinates;
    debugSkateparks(): Promise<{
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
}
