import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare class ReportController {
    private reportService;
    constructor();
    getDailyCollection: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getMonthlyCollection: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getCustomerLedger: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getLoanLedger: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getOutstandingReport: (_req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getDefaulterReport: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getRenewalReport: (_req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getProfitReport: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getExpenseReport: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=ReportController.d.ts.map