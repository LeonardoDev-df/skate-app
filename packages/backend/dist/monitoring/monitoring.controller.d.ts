import { FirebaseService } from '../firebase/firebase.service';
export declare class MonitoringController {
    private firebaseService;
    constructor(firebaseService: FirebaseService);
    getStats(): Promise<{
        collections: {
            users: number;
            skatistas: number;
            partidas: number;
            invites: number;
        };
        timestamp: string;
    }>;
    getDetailedHealth(): Promise<{
        status: string;
        timestamp: string;
        services: {
            firebase: string;
            firestore: string;
            auth: string;
        };
        version: string;
    }>;
}
