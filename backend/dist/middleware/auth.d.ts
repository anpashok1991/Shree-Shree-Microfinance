import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare function authenticate(req: AuthRequest, _res: Response, next: NextFunction): void;
export declare function authorize(...allowedRoles: string[]): (req: AuthRequest, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map