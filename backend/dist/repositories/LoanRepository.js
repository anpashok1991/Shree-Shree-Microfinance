"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class LoanRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super('loan');
    }
    async findByLoanNumber(loanNumber) {
        return this.delegate.findUnique({ where: { loanNumber } });
    }
    async findPendingApprovals() {
        return this.findAll({
            where: { status: 'PENDING_APPROVAL', isDeleted: false },
            include: {
                customer: true,
                createdBy: { select: { id: true, name: true, email: true } },
            },
        });
    }
    async findActiveLoans() {
        return this.findAll({
            where: { status: 'ACTIVE', isDeleted: false },
            include: { customer: true },
        });
    }
    async findOverdueLoans() {
        const hundredDaysAgo = new Date();
        hundredDaysAgo.setDate(hundredDaysAgo.getDate() - 100);
        return this.findAll({
            where: {
                status: 'ACTIVE',
                isDeleted: false,
                startDate: { lte: hundredDaysAgo },
                outstanding: { gt: 0 },
            },
            include: { customer: true },
        });
    }
    async findByCustomer(customerId) {
        return this.findAll({
            where: { customerId, isDeleted: false },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByStaff(staffId) {
        return this.findAll({
            where: { createdById: staffId, isDeleted: false },
            include: { customer: true },
        });
    }
    async getLoanHistory(loanId) {
        return this.delegate.findUnique({
            where: { id: loanId },
            include: {
                customer: true,
                collections: {
                    orderBy: { collectionDate: 'desc' },
                    where: { isDeleted: false },
                    include: { collectedBy: { select: { id: true, name: true } } },
                },
                renewedLoans: { where: { isDeleted: false } },
                parentLoan: true,
            },
        });
    }
    async getStats() {
        const result = await this.delegate.aggregate({
            where: { isDeleted: false, status: { in: ['ACTIVE', 'CLOSED'] } },
            _count: { id: true },
            _sum: { amount: true, outstanding: true, totalPaid: true },
        });
        return {
            activeLoans: result._count.id || 0,
            totalDisbursed: result._sum.amount || 0,
            totalOutstanding: result._sum.outstanding || 0,
            totalRecovered: result._sum.totalPaid || 0,
        };
    }
}
exports.LoanRepository = LoanRepository;
//# sourceMappingURL=LoanRepository.js.map