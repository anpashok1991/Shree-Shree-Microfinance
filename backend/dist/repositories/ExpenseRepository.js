"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class ExpenseRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super('expense');
    }
    async findByCategory(category) {
        return this.findAll({ where: { category, isDeleted: false } });
    }
    async getTotalByDateRange(startDate, endDate) {
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
exports.ExpenseRepository = ExpenseRepository;
//# sourceMappingURL=ExpenseRepository.js.map