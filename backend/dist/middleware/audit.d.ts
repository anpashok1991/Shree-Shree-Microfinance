import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare function auditLog(action: string, entity: string): (req: AuthRequest, _res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=audit.d.ts.map