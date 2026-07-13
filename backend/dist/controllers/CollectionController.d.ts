import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare class CollectionController {
    private collectionService;
    constructor();
    recordCollection: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getCollections: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getTodayStats: (_req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=CollectionController.d.ts.map