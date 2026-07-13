import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare class UploadController {
    private settingsRepo;
    private customerRepo;
    uploadLogo: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    uploadCustomerDocs: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=UploadController.d.ts.map