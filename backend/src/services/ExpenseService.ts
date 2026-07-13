import { ExpenseRepository } from '../repositories/ExpenseRepository';
import { NotFoundError } from '../utils/errors';
import { getPaginationParams } from '../utils/helpers';

export class ExpenseService {
  private expenseRepo: ExpenseRepository;

  constructor() {
    this.expenseRepo = new ExpenseRepository();
  }

  async createExpense(data: {
    description: string;
    amount: number;
    category: string;
    recordedById: string;
    remarks?: string;
    date?: Date;
  }) {
    return this.expenseRepo.create(data);
  }

  async getExpenses(page?: number, limit?: number) {
    const { page: p, limit: l, skip } = getPaginationParams(page, limit);
    const { data, total } = await this.expenseRepo.findWithPagination({
      where: {},
      page: p,
      limit: l,
      include: { recordedBy: { select: { id: true, name: true } } },
      orderBy: { date: 'desc' },
    });

    return {
      data,
      pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) },
    };
  }

  async deleteExpense(id: string, deletedById: string) {
    const expense = await this.expenseRepo.findById(id);
    if (!expense) throw new NotFoundError('Expense not found');
    await this.expenseRepo.softDelete(id, deletedById);
  }
}
