"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class AuditRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super('auditLog');
    }
    async findByUser(userId) {
        return this.findAll({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByEntity(entity, entityId) {
        return this.findAll({
            where: { entity, entityId },
            orderBy: { createdAt: 'desc' },
        });
    }
}
exports.AuditRepository = AuditRepository;
//# sourceMappingURL=AuditRepository.js.map