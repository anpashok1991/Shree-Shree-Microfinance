"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const ReportService_1 = require("../services/ReportService");
class ReportController {
    constructor() {
        this.getDailyCollection = async (req, res, next) => {
            try {
                const date = req.query.date ? new Date(req.query.date) : new Date();
                const data = await this.reportService.getDailyCollectionReport(date);
                res.json({ success: true, data });
            }
            catch (error) {
                next(error);
            }
        };
        this.getMonthlyCollection = async (req, res, next) => {
            try {
                const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
                const month = req.query.month ? parseInt(req.query.month) : new Date().getMonth() + 1;
                const data = await this.reportService.getMonthlyCollectionReport(year, month);
                res.json({ success: true, data });
            }
            catch (error) {
                next(error);
            }
        };
        this.getCustomerLedger = async (req, res, next) => {
            try {
                const data = await this.reportService.getCustomerLedger(req.params.customerId);
                res.json({ success: true, data });
            }
            catch (error) {
                next(error);
            }
        };
        this.getLoanLedger = async (req, res, next) => {
            try {
                const data = await this.reportService.getLoanLedger(req.params.loanId);
                res.json({ success: true, data });
            }
            catch (error) {
                next(error);
            }
        };
        this.getOutstandingReport = async (_req, res, next) => {
            try {
                const data = await this.reportService.getOutstandingReport();
                res.json({ success: true, data });
            }
            catch (error) {
                next(error);
            }
        };
        this.getDefaulterReport = async (req, res, next) => {
            try {
                const days = req.query.days ? parseInt(req.query.days) : 100;
                const data = await this.reportService.getDefaulterReport(days);
                res.json({ success: true, data });
            }
            catch (error) {
                next(error);
            }
        };
        this.getRenewalReport = async (_req, res, next) => {
            try {
                const data = await this.reportService.getRenewalReport();
                res.json({ success: true, data });
            }
            catch (error) {
                next(error);
            }
        };
        this.getProfitReport = async (req, res, next) => {
            try {
                const { startDate, endDate } = req.query;
                const data = await this.reportService.getProfitReport(startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1), endDate ? new Date(endDate) : new Date());
                res.json({ success: true, data });
            }
            catch (error) {
                next(error);
            }
        };
        this.getExpenseReport = async (req, res, next) => {
            try {
                const { startDate, endDate } = req.query;
                const data = await this.reportService.getExpenseReport(startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1), endDate ? new Date(endDate) : new Date());
                res.json({ success: true, data });
            }
            catch (error) {
                next(error);
            }
        };
        this.reportService = new ReportService_1.ReportService();
    }
}
exports.ReportController = ReportController;
//# sourceMappingURL=ReportController.js.map