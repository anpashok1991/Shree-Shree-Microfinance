import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare class BorrowerController {
    private borrowerService;
    constructor();
    getProfile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    saveProfile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=BorrowerController.d.ts.map