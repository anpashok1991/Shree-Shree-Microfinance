"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseController = void 0;
const ExpenseService_1 = require("../services/ExpenseService");
class ExpenseController {
    constructor() {
        this.createExpense = async (req, res, next) => {
            try {
                const expense = await this.expenseService.createExpense({
                    ...req.body,
                    recordedById: req.user.userId,
                });
                res.status(201).json({ success: true, message: 'Expense recorded', data: expense });
            }
            catch (error) {
                next(error);
            }
        };
        this.getExpenses = async (req, res, next) => {
            try {
                const { page, limit } = req.query;
                const result = await this.expenseService.getExpenses(page ? parseInt(page) : undefined, limit ? parseInt(limit) : undefined);
                res.json({ success: true, ...result });
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteExpense = async (req, res, next) => {
            try {
                await this.expenseService.deleteExpense(req.params.id, req.user.userId);
                res.json({ success: true, message: 'Expense deleted' });
            }
            catch (error) {
                next(error);
            }
        };
        this.expenseService = new ExpenseService_1.ExpenseService();
    }
}
exports.ExpenseController = ExpenseController;
//# sourceMappingURL=ExpenseController.js.map