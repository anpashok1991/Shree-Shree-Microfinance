import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';

import { prisma } from '../config/prisma';

export function auditLog(action: string, entity: string) {
  return async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const ipAddress = req.ip || req.socket.remoteAddress || undefined;
      const userAgent = req.headers['user-agent'] || undefined;

      await prisma.auditLog.create({
        data: {
          userId: req.user?.userId || 'system',
          action,
          entity,
          entityId: req.params.id || req.body?.id || 'unknown',
          ipAddress,
          userAgent,
        },
      });
    } catch (error) {
      // Don't block the request if audit logging fails
      console.error('Audit log error:', error);
    }
    next();
  };
}
