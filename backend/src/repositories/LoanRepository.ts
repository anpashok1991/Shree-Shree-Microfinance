import { BaseRepository } from './BaseRepository';
import { Loan, Prisma } from '@prisma/client';

export class LoanRepository extends BaseRepository<Loan> {
  constructor() {
    super('loan');
  }

  async findByLoanNumber(loanNumber: string): Promise<Loan | null> {
    return this.delegate.findUnique({ where: { loanNumber } });
  }

  async findPendingApprovals(): Promise<Loan[]> {
    return this.findAll({
      where: { status: 'PENDING_APPROVAL', isDeleted: false },
      include: {
        customer: true,
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findActiveLoans(): Promise<Loan[]> {
    return this.findAll({
      where: { status: 'ACTIVE', isDeleted: false },
      include: { customer: true },
    });
  }

  async findOverdueLoans(): Promise<Loan[]> {
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

  async findByCustomer(customerId: string): Promise<Loan[]> {
    return this.findAll({
      where: { customerId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByStaff(staffId: string): Promise<Loan[]> {
    return this.findAll({
      where: { createdById: staffId, isDeleted: false },
      include: { customer: true },
    });
  }

  async getLoanHistory(loanId: string) {
    return this.delegate.findUnique({
      where: { id: loanId },
      include: {
        customer: true,
        collections: {
          orderBy: { collectionDate: 'desc' },
          where: { isDeleted: false },
          include: {
            collectedBy: { select: { id: true, name: true } },
            receipt: true,
          },
        },
        renewedLoans: { where: { isDeleted: false } },
        parentLoan: true,
      },
    }) as Promise<Prisma.LoanGetPayload<{ include: { customer: true; collections: { include: { collectedBy: { select: { id: true; name: true } }; receipt: true } }; renewedLoans: true; parentLoan: true } }> | null>;
  }

  async getStats(): Promise<{
    activeLoans: number;
    totalDisbursed: number;
    totalOutstanding: number;
    totalRecovered: number;
  }> {
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
