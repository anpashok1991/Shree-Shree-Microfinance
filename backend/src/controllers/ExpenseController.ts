import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { ExpenseService } from '../services/ExpenseService';

export class ExpenseController {
  private expenseService: ExpenseService;

  constructor() {
    this.expenseService = new ExpenseService();
  }

  createExpense = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const expense = await this.expenseService.createExpense({
        ...req.body,
        recordedById: req.user!.userId,
      });
      res.status(201).json({ success: true, message: 'Expense recorded', data: expense });
    } catch (error) {
      next(error);
    }
  };

  getExpenses = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = req.query;
      const result = await this.expenseService.getExpenses(
        page ? parseInt(page as string) : undefined,
        limit ? parseInt(limit as string) : undefined
      );
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  deleteExpense = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.expenseService.deleteExpense(req.params.id as string, req.user!.userId);
      res.json({ success: true, message: 'Expense deleted' });
    } catch (error) {
      next(error);
    }
  };
}
