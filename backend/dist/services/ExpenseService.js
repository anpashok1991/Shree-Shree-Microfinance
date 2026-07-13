"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseService = void 0;
const ExpenseRepository_1 = require("../repositories/ExpenseRepository");
const errors_1 = require("../utils/errors");
const helpers_1 = require("../utils/helpers");
class ExpenseService {
    constructor() {
        this.expenseRepo = new ExpenseRepository_1.ExpenseRepository();
    }
    async createExpense(data) {
        return this.expenseRepo.create(data);
    }
    async getExpenses(page, limit) {
        const { page: p, limit: l, skip } = (0, helpers_1.getPaginationParams)(page, limit);
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
    async deleteExpense(id, deletedById) {
        const expense = await this.expenseRepo.findById(id);
        if (!expense)
            throw new errors_1.NotFoundError('Expense not found');
        await this.expenseRepo.softDelete(id, deletedById);
    }
}
exports.ExpenseService = ExpenseService;
//# sourceMappingURL=ExpenseService.js.map