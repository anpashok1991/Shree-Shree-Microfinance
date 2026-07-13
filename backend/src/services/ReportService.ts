import { prisma } from '../config/prisma';
import { CollectionRepository } from '../repositories/CollectionRepository';
import { LoanRepository } from '../repositories/LoanRepository';
import { CustomerRepository } from '../repositories/CustomerRepository';
import { AuditRepository } from '../repositories/AuditRepository';

export class ReportService {
  private collectionRepo: CollectionRepository;
  private loanRepo: LoanRepository;
  private customerRepo: CustomerRepository;
  private auditRepo: AuditRepository;

  constructor() {
    this.collectionRepo = new CollectionRepository();
    this.loanRepo = new LoanRepository();
    this.customerRepo = new CustomerRepository();
    this.auditRepo = new AuditRepository();
  }

  async getDailyCollectionReport(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.collectionRepo.findAll({
      where: { collectionDate: { gte: startOfDay, lte: endOfDay } },
      include: {
        customer: { select: { name: true, mobile: true, area: true } },
        loan: { select: { loanNumber: true } },
        collectedBy: { select: { name: true } },
      },
      orderBy: { collectionDate: 'asc' },
    });
  }

  async getMonthlyCollectionReport(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    return this.collectionRepo.findAll({
      where: { collectionDate: { gte: startDate, lte: endDate } },
      include: {
        customer: { select: { name: true, mobile: true, area: true } },
        loan: { select: { loanNumber: true } },
        collectedBy: { select: { name: true } },
      },
      orderBy: { collectionDate: 'desc' },
    });
  }

  async getCustomerLedger(customerId: string) {
    const [loans, collections] = await Promise.all([
      this.loanRepo.findByCustomer(customerId),
      this.collectionRepo.findAll({
        where: { customerId },
        include: { loan: { select: { loanNumber: true } } },
        orderBy: { collectionDate: 'desc' },
      }),
    ]);

    return { loans, collections };
  }

  async getLoanLedger(loanId: string) {
    return this.loanRepo.getLoanHistory(loanId);
  }

  async getOutstandingReport() {
    return this.loanRepo.findAll({
      where: { status: 'ACTIVE', outstanding: { gt: 0 } },
      include: {
        customer: { select: { name: true, mobile: true, area: true, assignedStaff: { select: { name: true } } } },
      },
      orderBy: { outstanding: 'desc' },
    });
  }

  async getDefaulterReport(daysOverdue: number = 100) {
    const overdueDate = new Date();
    overdueDate.setDate(overdueDate.getDate() - daysOverdue);

    return this.loanRepo.findAll({
      where: {
        status: 'ACTIVE',
        startDate: { lte: overdueDate },
        outstanding: { gt: 0 },
      },
      include: {
        customer: { select: { name: true, mobile: true, area: true } },
      },
      orderBy: { outstanding: 'desc' },
    });
  }

  async getRenewalReport() {
    return this.loanRepo.findAll({
      where: { status: 'RENEWED' },
      include: {
        customer: { select: { name: true, mobile: true } },
        parentLoan: { select: { loanNumber: true } },
        renewedLoans: { select: { loanNumber: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProfitReport(startDate: Date, endDate: Date) {
    const loans = await this.loanRepo.findAll({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: { in: ['ACTIVE', 'CLOSED', 'RENEWED'] },
      },
    });

    const totalDisbursed = loans.reduce((sum, l) => sum + l.amount, 0);
    const totalFileCharges = loans.reduce((sum, l) => sum + l.fileCharge, 0);
    const totalRecovered = loans.reduce((sum, l) => sum + l.totalPaid, 0);
    const totalOutstanding = loans.reduce((sum, l) => sum + l.outstanding, 0);
    const totalRenewalCharges = loans.reduce(
      (sum, l) => sum + (l.renewalCharge || 0),
      0
    );
    const expectedProfit = totalRecovered - totalDisbursed + totalRenewalCharges;

    return {
      totalDisbursed,
      totalFileCharges,
      totalRecovered,
      totalOutstanding,
      totalRenewalCharges,
      expectedProfit,
      loanCount: loans.length,
    };
  }

  async getExpenseReport(startDate: Date, endDate: Date) {
    return prisma.expense.findMany({
      where: {
        isDeleted: false,
        date: { gte: startDate, lte: endDate },
      },
      include: { recordedBy: { select: { name: true } } },
      orderBy: { date: 'desc' },
    });
  }
}
