import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare class SettingsController {
    private settingsService;
    constructor();
    getSettings: (_req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getSetting: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    updateSetting: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=SettingsController.d.ts.map