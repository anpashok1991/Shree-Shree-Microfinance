import { BaseRepository } from './BaseRepository';
import { Area } from '@prisma/client';

export class AreaRepository extends BaseRepository<Area> {
  constructor() {
    super('area');
  }

  async findByName(name: string): Promise<Area | null> {
    return this.findFirst({ name, isDeleted: false });
  }

  async findByCode(code: string): Promise<Area | null> {
    return this.findFirst({ code, isDeleted: false });
  }

  async findAllWithStats(): Promise<Area[]> {
    return this.delegate.findMany({
      where: { isDeleted: false },
      include: {
        _count: { select: { customers: true, users: true } },
      },
    });
  }
}
