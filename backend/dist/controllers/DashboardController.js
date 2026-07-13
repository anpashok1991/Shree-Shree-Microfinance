"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const DashboardService_1 = require("../services/DashboardService");
class DashboardController {
    constructor() {
        this.getStats = async (_req, res, next) => {
            try {
                const stats = await this.dashboardService.getDashboardStats();
                res.json({ success: true, data: stats });
            }
            catch (error) {
                next(error);
            }
        };
        this.getMonthlyChart = async (req, res, next) => {
            try {
                const year = req.query.year ? parseInt(req.query.year) : undefined;
                const data = await this.dashboardService.getMonthlyChartData(year);
                res.json({ success: true, data });
            }
            catch (error) {
                next(error);
            }
        };
        this.getAreaWiseCollection = async (_req, res, next) => {
            try {
                const data = await this.dashboardService.getAreaWiseCollection();
                res.json({ success: true, data });
            }
            catch (error) {
                next(error);
            }
        };
        this.getStaffPerformance = async (_req, res, next) => {
            try {
                const data = await this.dashboardService.getStaffPerformance();
                res.json({ success: true, data });
            }
            catch (error) {
                next(error);
            }
        };
        this.dashboardService = new DashboardService_1.DashboardService();
    }
}
exports.DashboardController = DashboardController;
//# sourceMappingURL=DashboardController.js.map