import { FirebaseService } from '../firebase/firebase.service';
export declare class UserService {
    private firebaseService;
    constructor(firebaseService: FirebaseService);
    findAll(limit?: number, page?: number): Promise<{
        users: any[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(uid: string): Promise<{
        id: string;
    }>;
    create(uid: string, userData: any): Promise<{
        message: string;
        user: any;
    }>;
    update(uid: string, updateData: any): Promise<{
        message: string;
        uid: string;
    }>;
    delete(uid: string): Promise<{
        message: string;
        uid: string;
    }>;
    isAdmin(uid: string): Promise<boolean>;
    getUserSkateparks(uid: string): Promise<{
        skateparks: any[];
        count?: undefined;
    } | {
        skateparks: any;
        count: any;
    }>;
    addSkatepark(uid: string, parkId: string): Promise<{
        message: string;
        parkId: string;
    }>;
}
