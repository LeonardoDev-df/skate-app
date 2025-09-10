import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    findAll(req: any, limit?: string, page?: string): Promise<{
        users: any[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getMyProfile(req: any): Promise<{
        id: string;
    }>;
    findOne(uid: string, req: any): Promise<{
        id: string;
    }>;
    create(createUserDto: any, req: any): Promise<{
        message: string;
        user: any;
    }>;
    update(uid: string, updateUserDto: any, req: any): Promise<{
        message: string;
        uid: string;
    }>;
    delete(uid: string, req: any): Promise<{
        message: string;
        uid: string;
    }>;
    getUserSkateparks(uid: string, req: any): Promise<{
        skateparks: any[];
        count?: undefined;
    } | {
        skateparks: any;
        count: any;
    }>;
    addSkatepark(uid: string, parkId: string, req: any): Promise<{
        message: string;
        parkId: string;
    }>;
}
