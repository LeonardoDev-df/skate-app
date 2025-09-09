import { AppService } from './app.service';
import { FirebaseService } from './firebase/firebase.service';
export declare class AppController {
    private readonly appService;
    private readonly firebaseService;
    constructor(appService: AppService, firebaseService: FirebaseService);
    getHello(): string;
    getHealth(): Promise<{
        status: string;
        message: string;
        firebase: {
            connected: boolean;
            collections: {
                users: number;
            };
            error?: undefined;
        };
        timestamp: string;
        version: string;
    } | {
        status: string;
        message: string;
        firebase: {
            connected: boolean;
            error: any;
            collections?: undefined;
        };
        timestamp: string;
        version: string;
    }>;
    testFirebase(): Promise<{
        status: string;
        message: string;
        collections: {};
        timestamp: string;
        error?: undefined;
    } | {
        status: string;
        message: string;
        error: any;
        timestamp: string;
        collections?: undefined;
    }>;
}
