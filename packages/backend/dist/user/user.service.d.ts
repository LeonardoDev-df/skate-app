import { FirebaseConfig } from '../config/firebase.config';
export declare class UserService {
    private firebaseConfig;
    constructor(firebaseConfig: FirebaseConfig);
    findAll(): Promise<{
        id: string;
    }[]>;
    findOne(uid: string): Promise<{
        id: string;
    }>;
    create(uid: string, userData: any): Promise<{
        id: string;
    }>;
    update(uid: string, updateData: any): Promise<{
        id: string;
    }>;
    delete(uid: string): Promise<{
        message: string;
    }>;
}
