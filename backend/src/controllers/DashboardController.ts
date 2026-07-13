import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { DashboardService } from '../services/DashboardService';

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  getStats = async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const stats = await this.dashboardService.getDashboardStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  };

  getMonthlyChart = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const year = req.query.year ? parseInt(req.query.year as string) : undefined;
      const data = await this.dashboardService.getMonthlyChartData(year);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  getAreaWiseCollection = async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.dashboardService.getAreaWiseCollection();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  getStaffPerformance = async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.dashboardService.getStaffPerformance();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };
}
