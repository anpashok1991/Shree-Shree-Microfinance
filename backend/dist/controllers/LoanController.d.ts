import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare class LoanController {
    private loanService;
    constructor();
    createLoan: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getLoans: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getLoanById: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getPendingApprovals: (_req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    approveLoan: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    rejectLoan: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    returnLoan: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    forecloseLoan: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    renewLoan: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    borrowerApply: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    calculateLoan: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    updateLoan: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    generateNoc: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=LoanController.d.ts.map