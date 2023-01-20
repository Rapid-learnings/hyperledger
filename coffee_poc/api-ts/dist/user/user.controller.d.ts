import { UserService } from './user.service';
import { UserDto } from './dto/user.dto/user.dto';
import { AdminDto } from './dto/admin.dto/admin.dto';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    registerAdmin(req: any, adminBody: AdminDto, res: any): Promise<void>;
    registerUser(usrBody: UserDto, res: any): Promise<void>;
}
