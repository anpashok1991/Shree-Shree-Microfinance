import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare class ExpenseController {
    private expenseService;
    constructor();
    createExpense: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getExpenses: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    deleteExpense: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=ExpenseController.d.ts.map