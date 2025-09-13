import { FirebaseService } from '../firebase/firebase.service';
interface CreateSkatistaDto {
    uid?: string;
    email: string;
    name: string;
    image?: string;
    invitation?: any;
    spots?: any[];
    status?: 'Online' | 'Offline';
}
interface UpdateSkatistaDto {
    name?: string;
    image?: string;
    spots?: any[];
    status?: 'Online' | 'Offline';
}
export declare class SkatistasController {
    private firebaseService;
    constructor(firebaseService: FirebaseService);
    findAll(): Promise<{
        skatistas: any[];
        total: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
    }>;
    create(createData: CreateSkatistaDto): Promise<{
        message: string;
        id: string;
        skatista: {
            uid: string;
            email: string;
            name: string;
            image: string;
            invitation: any;
            spots: any[];
            status: "Online" | "Offline";
            createdAt: string;
            updatedAt: string;
        };
    }>;
    update(id: string, updateData: UpdateSkatistaDto, req: any): Promise<{
        message: string;
        id: string;
    }>;
    getSpots(id: string): Promise<{
        spots: any;
        total: any;
    }>;
    addSpot(id: string, spotData: any, req: any): Promise<{
        message: string;
        spots: any[];
    }>;
    removeSpot(id: string, spotIndex: string, req: any): Promise<{
        message: string;
        spots: any;
    }>;
}
export {};
