import { prisma } from '../config/prisma';
import { CollectionRepository } from '../repositories/CollectionRepository';
import { LoanRepository } from '../repositories/LoanRepository';
import { CustomerRepository } from '../repositories/CustomerRepository';
import { DashboardStats } from '../types';

export class DashboardService {
  private collectionRepo: CollectionRepository;
  private loanRepo: LoanRepository;
  private customerRepo: CustomerRepository;

  constructor() {
    this.collectionRepo = new CollectionRepository();
    this.loanRepo = new LoanRepository();
    this.customerRepo = new CustomerRepository();
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const [
      todayCollection,
      monthlyCollection,
      activeLoans,
      pendingApprovals,
      overdueLoans,
      totalCustomers,
      loanStats,
    ] = await Promise.all([
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

  async getMonthlyChartData(year: number = new Date().getFullYear()) {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const data = await Promise.all(
      months.map(async (month) => {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);
        const result = await this.collectionRepo.findAll({
          where: {
            collectionDate: { gte: startDate, lte: endDate },
          },
        });
        const total = result.reduce((sum, c) => sum + c.amount, 0);
        return { month, total };
      })
    );
    return data;
  }

  async getAreaWiseCollection() {
    return prisma.area.findMany({
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
    return prisma.user.findMany({
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
