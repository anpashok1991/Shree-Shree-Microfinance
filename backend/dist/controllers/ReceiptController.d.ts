import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare class ReceiptController {
    private receiptRepo;
    getByCollection: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getByLoan: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=ReceiptController.d.ts.map