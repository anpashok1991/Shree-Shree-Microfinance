import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare class CustomerController {
    private customerService;
    constructor();
    createCustomer: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getCustomers: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getCustomerById: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    updateCustomer: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    deleteCustomer: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    searchCustomers: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=CustomerController.d.ts.map