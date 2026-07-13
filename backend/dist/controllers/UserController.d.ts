import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare class UserController {
    private userService;
    constructor();
    createUser: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getUsers: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getUserById: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    updateUser: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    deleteUser: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    toggleStatus: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    lockUser: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    unlockUser: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    resetPassword: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getStaffList: (_req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=UserController.d.ts.map