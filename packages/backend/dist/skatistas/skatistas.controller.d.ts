import { FirebaseService } from '../firebase/firebase.service';
export declare class SkatistasController {
    private firebaseService;
    constructor(firebaseService: FirebaseService);
    findAll(): Promise<{
        id: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
    }>;
    create(createData: any): Promise<FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> | FirebaseFirestore.WriteResult>;
}
