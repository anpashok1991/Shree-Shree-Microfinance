import { BaseRepository } from './BaseRepository';
import { Expense } from '@prisma/client';

export class ExpenseRepository extends BaseRepository<Expense> {
  constructor() {
    super('expense');
  }

  async findByCategory(category: string): Promise<Expense[]> {
    return this.findAll({ where: { category, isDeleted: false } });
  }

  async getTotalByDateRange(startDate: Date, endDate: Date): Promise<number> {
    const result = await this.delegate.aggregate({
      where: {
        isDeleted: false,
        date: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  }
}
