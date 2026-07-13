import { Request, Response, NextFunction } from 'express';
export declare class EnquiryController {
    private service;
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    markRead: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    respond: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=EnquiryController.d.ts.map