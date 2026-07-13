import { BaseRepository } from './BaseRepository';
import { Expense } from '@prisma/client';
export declare class ExpenseRepository extends BaseRepository<Expense> {
    constructor();
    findByCategory(category: string): Promise<Expense[]>;
    getTotalByDateRange(startDate: Date, endDate: Date): Promise<number>;
}
//# sourceMappingURL=ExpenseRepository.d.ts.map