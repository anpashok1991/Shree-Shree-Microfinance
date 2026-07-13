import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare class SearchController {
    private searchService;
    constructor();
    globalSearch: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=SearchController.d.ts.map