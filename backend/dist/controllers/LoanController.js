"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanController = void 0;
const LoanService_1 = require("../services/LoanService");
class LoanController {
    constructor() {
        this.createLoan = async (req, res, next) => {
            try {
                const loan = await this.loanService.createLoan({
                    ...req.body,
                    createdById: req.user.userId,
                });
                res.status(201).json({ success: true, message: 'Loan application submitted', data: loan });
            }
            catch (error) {
                next(error);
            }
        };
        this.getLoans = async (req, res, next) => {
            try {
                const { page, limit, status, customerId, staffId } = req.query;
                let resolvedCustomerId = customerId;
                if (customerId === 'me' && req.user?.role === 'BORROWER') {
                    const customer = await this.loanService.findCustomerByUserId(req.user.userId);
                    if (!customer)
                        return res.json({ success: true, data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } });
                    resolvedCustomerId = customer.id;
                }
                const result = await this.loanService.getLoans(page ? parseInt(page) : undefined, limit ? parseInt(limit) : undefined, status, resolvedCustomerId, req.user?.role === 'STAFF' ? req.user.userId : staffId);
                res.json({ success: true, ...result });
            }
            catch (error) {
                next(error);
            }
        };
        this.getLoanById = async (req, res, next) => {
            try {
                const loan = await this.loanService.getLoanDetails(req.params.id);
                res.json({ success: true, data: loan });
            }
            catch (error) {
                next(error);
            }
        };
        this.getPendingApprovals = async (_req, res, next) => {
            try {
                const loans = await this.loanService.getPendingApprovals();
                res.json({ success: true, data: loans });
            }
            catch (error) {
                next(error);
            }
        };
        this.approveLoan = async (req, res, next) => {
            try {
                const loan = await this.loanService.approveLoan(req.params.id, req.user.userId);
                res.json({ success: true, message: 'Loan approved successfully', data: loan });
            }
            catch (error) {
                next(error);
            }
        };
        this.rejectLoan = async (req, res, next) => {
            try {
                const { reason } = req.body;
                const loan = await this.loanService.rejectLoan(req.params.id, reason, req.user.userId);
                res.json({ success: true, message: 'Loan rejected', data: loan });
            }
            catch (error) {
                next(error);
            }
        };
        this.returnLoan = async (req, res, next) => {
            try {
                const { reason } = req.body;
                const loan = await this.loanService.returnLoan(req.params.id, reason, req.user.userId);
                res.json({ success: true, message: 'Loan returned for correction', data: loan });
            }
            catch (error) {
                next(error);
            }
        };
        this.renewLoan = async (req, res, next) => {
            try {
                const loan = await this.loanService.renewLoan(req.params.id, req.user.userId);
                res.status(201).json({ success: true, message: 'Loan renewed successfully', data: loan });
            }
            catch (error) {
                next(error);
            }
        };
        this.borrowerApply = async (req, res, next) => {
            try {
                const loan = await this.loanService.borrowerApply(req.user.userId, req.body);
                res.status(201).json({ success: true, message: 'Loan application submitted', data: loan });
            }
            catch (error) {
                next(error);
            }
        };
        this.calculateLoan = async (req, res, next) => {
            try {
                const { amount } = req.query;
                const calculation = await this.loanService.calculateLoanAmount(amount ? parseFloat(amount) : 0);
                res.json({ success: true, data: calculation });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateLoan = async (req, res, next) => {
            try {
                const loan = await this.loanService.updateLoan(req.params.id, req.body, req.user.userId);
                res.json({ success: true, message: 'Loan updated', data: loan });
            }
            catch (error) {
                next(error);
            }
        };
        this.loanService = new LoanService_1.LoanService();
    }
}
exports.LoanController = LoanController;
//# sourceMappingURL=LoanController.js.map