import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare class AuthController {
    private authService;
    constructor();
    login: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getProfile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    changePassword: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=AuthController.d.ts.map