import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare class AreaController {
    private areaService;
    constructor();
    createArea: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getAreas: (_req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getAreaById: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    updateArea: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    deleteArea: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=AreaController.d.ts.map