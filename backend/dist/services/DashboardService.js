"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const prisma_1 = require("../config/prisma");
const CollectionRepository_1 = require("../repositories/CollectionRepository");
const LoanRepository_1 = require("../repositories/LoanRepository");
const CustomerRepository_1 = require("../repositories/CustomerRepository");
class DashboardService {
    constructor() {
        this.collectionRepo = new CollectionRepository_1.CollectionRepository();
        this.loanRepo = new LoanRepository_1.LoanRepository();
        this.customerRepo = new CustomerRepository_1.CustomerRepository();
    }
    async getDashboardStats() {
        const [todayCollection, monthlyCollection, activeLoans, pendingApprovals, overdueLoans, totalCustomers, loanStats,] = await Promise.all([
            this.collectionRepo.getTodayCollection(),
            this.collectionRepo.getMonthlyCollection(),
            this.loanRepo.count({ status: 'ACTIVE' }),
            this.loanRepo.count({ status: 'PENDING_APPROVAL' }),
            this.loanRepo.count({
                status: 'ACTIVE',
                outstanding: { gt: 0 },
                startDate: {
                    lte: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
                },
            }),
            this.customerRepo.count(),
            this.loanRepo.getStats(),
        ]);
        const totalProfit = loanStats.totalRecovered - loanStats.totalDisbursed;
        return {
            todayCollection,
            monthlyCollection,
            activeLoans,
            pendingApprovals,
            overdueLoans,
            totalCustomers,
            totalProfit,
            totalOutstanding: loanStats.totalOutstanding,
        };
    }
    async getMonthlyChartData(year = new Date().getFullYear()) {
        const months = Array.from({ length: 12 }, (_, i) => i + 1);
        const data = await Promise.all(months.map(async (month) => {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59, 999);
            const result = await this.collectionRepo.findAll({
                where: {
                    collectionDate: { gte: startDate, lte: endDate },
                },
            });
            const total = result.reduce((sum, c) => sum + c.amount, 0);
            return { month, total };
        }));
        return data;
    }
    async getAreaWiseCollection() {
        return prisma_1.prisma.area.findMany({
            include: {
                _count: { select: { customers: true } },
                customers: {
                    include: {
                        loans: {
                            where: { status: 'ACTIVE' },
                            select: { outstanding: true, totalPaid: true },
                        },
                    },
                },
            },
        });
    }
    async getStaffPerformance() {
        return prisma_1.prisma.user.findMany({
            where: { role: 'STAFF' },
            select: {
                id: true,
                name: true,
                email: true,
                _count: { select: { assignedCustomers: true, collections: true } },
                collections: {
                    select: { amount: true },
                },
            },
        });
    }
}
exports.DashboardService = DashboardService;
//# sourceMappingURL=DashboardService.js.map