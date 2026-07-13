import { BaseRepository } from './BaseRepository';
import { AuditLog } from '@prisma/client';

export class AuditRepository extends BaseRepository<AuditLog> {
  constructor() {
    super('auditLog');
  }

  async findByUser(userId: string): Promise<AuditLog[]> {
    return this.findAll({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByEntity(entity: string, entityId: string): Promise<AuditLog[]> {
    return this.findAll({
      where: { entity, entityId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
