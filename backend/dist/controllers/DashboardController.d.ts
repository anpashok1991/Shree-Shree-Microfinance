import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare class DashboardController {
    private dashboardService;
    constructor();
    getStats: (_req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getMonthlyChart: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getAreaWiseCollection: (_req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getStaffPerformance: (_req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=DashboardController.d.ts.map