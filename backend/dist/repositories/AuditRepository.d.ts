import { BaseRepository } from './BaseRepository';
import { AuditLog } from '@prisma/client';
export declare class AuditRepository extends BaseRepository<AuditLog> {
    constructor();
    findByUser(userId: string): Promise<AuditLog[]>;
    findByEntity(entity: string, entityId: string): Promise<AuditLog[]>;
}
//# sourceMappingURL=AuditRepository.d.ts.map