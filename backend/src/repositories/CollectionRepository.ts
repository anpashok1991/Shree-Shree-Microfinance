import { BaseRepository } from './BaseRepository';
import { Collection } from '@prisma/client';

export class CollectionRepository extends BaseRepository<Collection> {
  constructor() {
    super('collection');
  }

  async findByLoan(loanId: string): Promise<Collection[]> {
    return this.findAll({
      where: { loanId, isDeleted: false },
      orderBy: { collectionDate: 'desc' },
    });
  }

  async findByStaff(staffId: string, date?: Date): Promise<Collection[]> {
    const where: any = { collectedById: staffId, isDeleted: false };
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      where.collectionDate = { gte: startOfDay, lte: endOfDay };
    }
    return this.findAll({
      where,
      include: { customer: true, loan: true },
      orderBy: { collectionDate: 'desc' },
    });
  }

  async getTodayCollection(): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const result = await this.delegate.aggregate({
      where: {
        isDeleted: false,
        collectionDate: { gte: startOfDay, lte: endOfDay },
      },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  }

  async getMonthlyCollection(): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const result = await this.delegate.aggregate({
      where: {
        isDeleted: false,
        collectionDate: { gte: startOfMonth },
      },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  }

  async getStaffPerformance(staffId: string): Promise<{
    totalCollected: number;
    collectionCount: number;
  }> {
    const result = await this.delegate.aggregate({
      where: { collectedById: staffId, isDeleted: false },
      _sum: { amount: true },
      _count: { id: true },
    });
    return {
      totalCollected: result._sum.amount || 0,
      collectionCount: result._count.id || 0,
    };
  }
}
