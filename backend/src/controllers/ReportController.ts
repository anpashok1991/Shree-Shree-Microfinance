import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { ReportService } from '../services/ReportService';

export class ReportController {
  private reportService: ReportService;

  constructor() {
    this.reportService = new ReportService();
  }

  getDailyCollection = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : new Date();
      const data = await this.reportService.getDailyCollectionReport(date);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  getMonthlyCollection = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const year = req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear();
      const month = req.query.month ? parseInt(req.query.month as string) : new Date().getMonth() + 1;
      const data = await this.reportService.getMonthlyCollectionReport(year, month);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  getCustomerLedger = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.reportService.getCustomerLedger(req.params.customerId as string);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  getLoanLedger = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.reportService.getLoanLedger(req.params.loanId as string);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  getOutstandingReport = async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.reportService.getOutstandingReport();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  getDefaulterReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const days = req.query.days ? parseInt(req.query.days as string) : 100;
      const data = await this.reportService.getDefaulterReport(days);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  getRenewalReport = async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.reportService.getRenewalReport();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  getProfitReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate } = req.query;
      const data = await this.reportService.getProfitReport(
        startDate ? new Date(startDate as string) : new Date(new Date().getFullYear(), 0, 1),
        endDate ? new Date(endDate as string) : new Date()
      );
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  getExpenseReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate } = req.query;
      const data = await this.reportService.getExpenseReport(
        startDate ? new Date(startDate as string) : new Date(new Date().getFullYear(), 0, 1),
        endDate ? new Date(endDate as string) : new Date()
      );
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };
}
