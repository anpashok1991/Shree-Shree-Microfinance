"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLog = auditLog;
const prisma_1 = require("../config/prisma");
function auditLog(action, entity) {
    return async (req, _res, next) => {
        try {
            const ipAddress = req.ip || req.socket.remoteAddress || undefined;
            const userAgent = req.headers['user-agent'] || undefined;
            await prisma_1.prisma.auditLog.create({
                data: {
                    userId: req.user?.userId || 'system',
                    action,
                    entity,
                    entityId: req.params.id || req.body?.id || 'unknown',
                    ipAddress,
                    userAgent,
                },
            });
        }
        catch (error) {
            // Don't block the request if audit logging fails
            console.error('Audit log error:', error);
        }
        next();
    };
}
//# sourceMappingURL=audit.js.map