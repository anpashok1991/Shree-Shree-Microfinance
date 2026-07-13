"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanService = void 0;
const LoanRepository_1 = require("../repositories/LoanRepository");
const CustomerRepository_1 = require("../repositories/CustomerRepository");
const AuditRepository_1 = require("../repositories/AuditRepository");
const SettingsRepository_1 = require("../repositories/SettingsRepository");
const errors_1 = require("../utils/errors");
const helpers_1 = require("../utils/helpers");
class LoanService {
    constructor() {
        this.loanRepo = new LoanRepository_1.LoanRepository();
        this.customerRepo = new CustomerRepository_1.CustomerRepository();
        this.auditRepo = new AuditRepository_1.AuditRepository();
        this.settingsRepo = new SettingsRepository_1.SettingsRepository();
    }
    async createLoan(data) {
        const customer = await this.customerRepo.findById(data.customerId);
        if (!customer)
            throw new errors_1.NotFoundError('Customer not found');
        const maxLoan = await this.settingsRepo.getNumberValue('max_loan', 50000);
        if (data.amount > maxLoan) {
            throw new errors_1.AppError(`Loan amount cannot exceed ₹${maxLoan}`, 400);
        }
        const fileChargePercent = await this.settingsRepo.getNumberValue('file_charge_percent', 3);
        const tenure = await this.settingsRepo.getNumberValue('loan_tenure_days', 100);
        const calculation = (0, helpers_1.calculateLoanDetails)(data.amount, fileChargePercent, tenure);
        const loanNumber = (0, helpers_1.generateLoanNumber)();
        const loan = await this.loanRepo.create({
            loanNumber,
            customerId: data.customerId,
            amount: calculation.amount,
            fileCharge: calculation.fileCharge,
            fileChargePercent: calculation.fileChargePercent,
            disbursedAmount: calculation.disbursedAmount,
            dailyCollection: calculation.dailyCollection,
            totalRecovery: calculation.totalRecovery,
            tenure: calculation.tenure,
            outstanding: calculation.totalRecovery,
            createdById: data.createdById,
            status: 'PENDING_APPROVAL',
        });
        await this.customerRepo.update(data.customerId, { status: 'PENDING' });
        await this.auditRepo.create({
            userId: data.createdById,
            action: 'CREATE',
            entity: 'Loan',
            entityId: loan.id,
        });
        return this.loanRepo.findById(loan.id, {
            customer: true,
            createdBy: { select: { id: true, name: true } },
        });
    }
    async approveLoan(loanId, approvedById) {
        const loan = await this.loanRepo.findById(loanId);
        if (!loan)
            throw new errors_1.NotFoundError('Loan not found');
        if (loan.status !== 'PENDING_APPROVAL') {
            throw new errors_1.AppError('Loan is not pending approval', 400);
        }
        const [updated] = await Promise.all([
            this.loanRepo.update(loanId, {
                status: 'ACTIVE',
                approvedById,
                approvedAt: new Date(),
                startDate: new Date(),
                endDate: new Date(Date.now() + loan.tenure * 24 * 60 * 60 * 1000),
            }),
            this.customerRepo.update(loan.customerId, { status: 'ACTIVE' }),
        ]);
        await this.auditRepo.create({
            userId: approvedById,
            action: 'APPROVE',
            entity: 'Loan',
            entityId: loanId,
            oldValue: 'PENDING_APPROVAL',
            newValue: 'ACTIVE',
        });
        return updated;
    }
    async rejectLoan(loanId, reason, rejectedById) {
        const loan = await this.loanRepo.findById(loanId);
        if (!loan)
            throw new errors_1.NotFoundError('Loan not found');
        const updated = await this.loanRepo.update(loanId, {
            status: 'REJECTED',
            rejectionReason: reason,
        });
        await this.auditRepo.create({
            userId: rejectedById,
            action: 'REJECT',
            entity: 'Loan',
            entityId: loanId,
            newValue: `REJECTED: ${reason}`,
        });
        return updated;
    }
    async returnLoan(loanId, reason, returnedById) {
        const loan = await this.loanRepo.findById(loanId);
        if (!loan)
            throw new errors_1.NotFoundError('Loan not found');
        const updated = await this.loanRepo.update(loanId, {
            status: 'RETURNED',
            returnReason: reason,
        });
        await this.auditRepo.create({
            userId: returnedById,
            action: 'UPDATE',
            entity: 'Loan',
            entityId: loanId,
            newValue: `RETURNED: ${reason}`,
        });
        return updated;
    }
    async getLoans(page, limit, status, customerId, staffId) {
        const { page: p, limit: l, skip } = (0, helpers_1.getPaginationParams)(page, limit);
        const where = {};
        if (status)
            where.status = status;
        if (customerId)
            where.customerId = customerId;
        if (staffId)
            where.createdById = staffId;
        const { data, total } = await this.loanRepo.findWithPagination({
            where,
            page: p,
            limit: l,
            include: {
                customer: true,
                approvedBy: { select: { id: true, name: true } },
                createdBy: { select: { id: true, name: true } },
            },
        });
        return {
            data,
            pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) },
        };
    }
    async getPendingApprovals() {
        return this.loanRepo.findPendingApprovals();
    }
    async getLoanDetails(loanId) {
        const loan = await this.loanRepo.getLoanHistory(loanId);
        if (!loan)
            throw new errors_1.NotFoundError('Loan not found');
        return loan;
    }
    async renewLoan(loanId, renewedById) {
        const loan = await this.loanRepo.findById(loanId);
        if (!loan)
            throw new errors_1.NotFoundError('Loan not found');
        if (loan.outstanding <= 0) {
            throw new errors_1.AppError('Loan has no outstanding balance', 400);
        }
        const renewalChargePercent = await this.settingsRepo.getNumberValue('renewal_charge_percent', 20);
        const { renewalCharge, newLoanAmount } = (0, helpers_1.calculateRenewal)(loan.outstanding, renewalChargePercent);
        const fileChargePercent = await this.settingsRepo.getNumberValue('file_charge_percent', 3);
        const tenure = await this.settingsRepo.getNumberValue('loan_tenure_days', 100);
        const calculation = (0, helpers_1.calculateLoanDetails)(newLoanAmount, fileChargePercent, tenure);
        const renewalNumber = (0, helpers_1.generateRenewalNumber)(loan.loanNumber);
        const newLoanNumber = (0, helpers_1.generateLoanNumber)();
        const renewedLoan = await this.loanRepo.create({
            loanNumber: newLoanNumber,
            renewalNumber,
            customerId: loan.customerId,
            amount: calculation.amount,
            fileCharge: calculation.fileCharge,
            fileChargePercent: calculation.fileChargePercent,
            disbursedAmount: calculation.disbursedAmount,
            dailyCollection: calculation.dailyCollection,
            totalRecovery: calculation.totalRecovery,
            tenure: calculation.tenure,
            parentLoanId: loanId,
            renewalCharge,
            outstanding: calculation.totalRecovery,
            status: 'ACTIVE',
            startDate: new Date(),
            endDate: new Date(Date.now() + calculation.tenure * 24 * 60 * 60 * 1000),
            createdById: renewedById,
            approvedById: renewedById,
            approvedAt: new Date(),
        });
        await this.loanRepo.update(loanId, {
            status: 'RENEWED',
            closedAt: new Date(),
        });
        await this.auditRepo.create({
            userId: renewedById,
            action: 'CREATE',
            entity: 'Loan',
            entityId: renewedLoan.id,
            newValue: `Renewed from ${loan.loanNumber}`,
        });
        return renewedLoan;
    }
    async borrowerApply(userId, data) {
        const customer = await this.customerRepo.findByUserId(userId);
        if (!customer)
            throw new errors_1.AppError('Please create your profile first.', 400);
        return this.createLoan({
            customerId: customer.id,
            amount: data.amount,
            createdById: userId,
        });
    }
    async updateLoan(loanId, data, updatedById) {
        const loan = await this.loanRepo.findById(loanId);
        if (!loan)
            throw new errors_1.NotFoundError('Loan not found');
        const allowedStatuses = ['PENDING_APPROVAL', 'RETURNED'];
        if (!allowedStatuses.includes(loan.status)) {
            throw new errors_1.AppError('Loan can only be edited when pending approval or returned', 400);
        }
        const updateData = {};
        if (data.amount && data.amount !== loan.amount) {
            const maxLoan = await this.settingsRepo.getNumberValue('max_loan', 50000);
            if (data.amount > maxLoan) {
                throw new errors_1.AppError(`Loan amount cannot exceed ₹${maxLoan}`, 400);
            }
            const fileChargePercent = await this.settingsRepo.getNumberValue('file_charge_percent', 3);
            const tenure = await this.settingsRepo.getNumberValue('loan_tenure_days', 100);
            const calculation = (0, helpers_1.calculateLoanDetails)(data.amount, fileChargePercent, tenure);
            updateData.amount = calculation.amount;
            updateData.fileCharge = calculation.fileCharge;
            updateData.fileChargePercent = calculation.fileChargePercent;
            updateData.disbursedAmount = calculation.disbursedAmount;
            updateData.dailyCollection = calculation.dailyCollection;
            updateData.totalRecovery = calculation.totalRecovery;
            updateData.tenure = calculation.tenure;
            updateData.outstanding = calculation.totalRecovery;
        }
        const updated = await this.loanRepo.update(loanId, updateData);
        await this.auditRepo.create({
            userId: updatedById,
            action: 'UPDATE',
            entity: 'Loan',
            entityId: loanId,
            oldValue: JSON.stringify(loan),
            newValue: JSON.stringify(updated),
        });
        return updated;
    }
    async findCustomerByUserId(userId) {
        return this.customerRepo.findByUserId(userId);
    }
    async calculateLoanAmount(amount) {
        const fileChargePercent = await this.settingsRepo.getNumberValue('file_charge_percent', 3);
        const tenure = await this.settingsRepo.getNumberValue('loan_tenure_days', 100);
        return (0, helpers_1.calculateLoanDetails)(amount, fileChargePercent, tenure);
    }
    async getActiveLoansByStaff(staffId) {
        return this.loanRepo.findAll({
            where: {
                status: 'ACTIVE',
                customer: { assignedStaffId: staffId },
            },
            include: { customer: true },
        });
    }
    async getActiveLoansByArea(areaId) {
        return this.loanRepo.findAll({
            where: {
                status: 'ACTIVE',
                customer: { areaId },
            },
            include: { customer: true },
        });
    }
}
exports.LoanService = LoanService;
//# sourceMappingURL=LoanService.js.map