import { Request, Response, NextFunction } from 'express';
export declare class PublicController {
    private settingsRepo;
    getCompanyInfo: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    getLogo: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
}
//# sourceMappingURL=PublicController.d.ts.map