import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    findAll(): Promise<{
        id: string;
    }[]>;
    findOne(uid: string): Promise<{
        id: string;
    }>;
    create(createUserDto: any): Promise<{
        id: string;
    }>;
    update(uid: string, updateUserDto: any): Promise<{
        id: string;
    }>;
    delete(uid: string): Promise<{
        message: string;
    }>;
}
