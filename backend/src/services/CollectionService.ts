import { CollectionRepository } from '../repositories/CollectionRepository';
import { LoanRepository } from '../repositories/LoanRepository';
import { CustomerRepository } from '../repositories/CustomerRepository';
import { ReceiptRepository } from '../repositories/ReceiptRepository';
import { AuditRepository } from '../repositories/AuditRepository';
import { NotFoundError, AppError } from '../utils/errors';
import { generateCollectionNo, generateReceiptNo, getPaginationParams } from '../utils/helpers';
import { prisma } from '../config/prisma';


export class CollectionService {
  private collectionRepo: CollectionRepository;
  private loanRepo: LoanRepository;
  private customerRepo: CustomerRepository;
  private receiptRepo: ReceiptRepository;
  private auditRepo: AuditRepository;

  constructor() {
    this.collectionRepo = new CollectionRepository();
    this.loanRepo = new LoanRepository();
    this.customerRepo = new CustomerRepository();
    this.receiptRepo = new ReceiptRepository();
    this.auditRepo = new AuditRepository();
  }

  async recordCollection(data: {
    loanId: string;
    customerId: string;
    amount: number;
    collectedById: string;
    collectedByRole?: string;
    remarks?: string;
    collectionDate?: string;
  }) {
    const loan: any = await this.loanRepo.findById(data.loanId, { customer: { select: { areaId: true } } });
    if (!loan) throw new NotFoundError('Loan not found');
    if (loan.status !== 'ACTIVE') {
      throw new AppError('Loan is not active', 400);
    }

    // STAFF can only collect for loans in their assigned areas
    if (data.collectedByRole === 'STAFF') {
      const userAreas = await prisma.userArea.findMany({ where: { userId: data.collectedById }, select: { areaId: true } });
      const areaIds = userAreas.map(ua => ua.areaId);
      if (areaIds.length > 0 && !areaIds.includes(loan.customer.areaId)) {
        throw new AppError('You can only collect payments for loans in your assigned area', 403);
      }
    }

    const newTotalPaid = loan.totalPaid + data.amount;
    const newOutstanding = Math.max(0, loan.outstanding - data.amount);

    const collectionNo = generateCollectionNo();
    const collection = await this.collectionRepo.create({
      collectionNo,
      loanId: data.loanId,
      customerId: data.customerId,
      amount: data.amount,
      collectedById: data.collectedById,
      remarks: data.remarks,
      ...(data.collectionDate ? { collectionDate: new Date(data.collectionDate) } : {}),
    });

    await this.loanRepo.update(data.loanId, {
      totalPaid: newTotalPaid,
      outstanding: newOutstanding,
    });

    if (newOutstanding <= 0) {
      await this.loanRepo.update(data.loanId, {
        status: 'CLOSED',
        closedAt: new Date(),
      });
      await this.customerRepo.update(data.customerId, { status: 'CLOSED' });
    }

    const receiptNo = generateReceiptNo();
    await this.receiptRepo.create({
      receiptNo,
      collectionId: collection.id,
      loanId: data.loanId,
      customerId: data.customerId,
      customerName: (await this.customerRepo.findById(data.customerId))?.name || '',
      amount: data.amount,
      balanceBefore: loan.outstanding,
      balanceAfter: newOutstanding,
      generatedById: data.collectedById,
    });

    await this.auditRepo.create({
      userId: data.collectedById,
      action: 'CREATE',
      entity: 'Collection',
      entityId: collection.id,
      newValue: `Amount: ${data.amount}, Loan: ${loan.loanNumber}`,
    });

    return this.collectionRepo.findById(collection.id, {
      customer: true,
      loan: true,
      collectedBy: { select: { id: true, name: true } },
      receipt: true,
    });
  }

  async getCollections(
    page?: number,
    limit?: number,
    loanId?: string,
    staffId?: string,
    startDate?: Date,
    endDate?: Date
  ) {
    const { page: p, limit: l, skip } = getPaginationParams(page, limit);

    const where: any = {};
    if (loanId) where.loanId = loanId;
    if (staffId) {
      const userAreas = await prisma.userArea.findMany({ where: { userId: staffId }, select: { areaId: true } });
      const areaIds = userAreas.map(ua => ua.areaId);
      if (areaIds.length > 0) {
        where.customer = { areaId: { in: areaIds } };
      } else {
        where.id = null;
      }
    }
    if (startDate || endDate) {
      where.collectionDate = {};
      if (startDate) where.collectionDate.gte = startDate;
      if (endDate) where.collectionDate.lte = endDate;
    }

    const { data, total } = await this.collectionRepo.findWithPagination({
      where,
      page: p,
      limit: l,
      include: {
        customer: { select: { id: true, name: true, mobile: true } },
        loan: { select: { id: true, loanNumber: true } },
        collectedBy: { select: { id: true, name: true } },
      },
    });

    return {
      data,
      pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) },
    };
  }

  async voidCollection(collectionId: string, voidedById: string) {
    const collection: any = await this.collectionRepo.findById(collectionId, { loan: true });
    if (!collection) throw new NotFoundError('Collection not found');

    const loan = collection.loan;
    const newTotalPaid = Math.max(0, loan.totalPaid - collection.amount);
    const newOutstanding = loan.outstanding + collection.amount;

    await this.collectionRepo.softDelete(collectionId, voidedById);
    await this.loanRepo.update(loan.id, {
      totalPaid: newTotalPaid,
      outstanding: newOutstanding,
      status: newOutstanding > 0 ? 'ACTIVE' : loan.status,
    });

    if (newOutstanding > 0) {
      await this.customerRepo.update(collection.customerId, { status: 'ACTIVE' });
    }

    await this.auditRepo.create({
      userId: voidedById,
      action: 'VOID',
      entity: 'Collection',
      entityId: collectionId,
      oldValue: `Amount: ${collection.amount}`,
    });
  }

  async getTodayStats() {
    const [todayCollection, monthlyCollection] = await Promise.all([
      this.collectionRepo.getTodayCollection(),
      this.collectionRepo.getMonthlyCollection(),
    ]);
    return { todayCollection, monthlyCollection };
  }

  async getStaffCollectionReport(staffId: string, startDate: Date, endDate: Date) {
    return this.collectionRepo.findAll({
      where: {
        collectedById: staffId,
        collectionDate: { gte: startDate, lte: endDate },
      },
      include: { customer: true, loan: true },
      orderBy: { collectionDate: 'desc' },
    });
  }

  async getAreaCollectionReport(areaId: string, startDate: Date, endDate: Date) {
    return this.collectionRepo.findAll({
      where: {
        collectionDate: { gte: startDate, lte: endDate },
        customer: { areaId },
      },
      include: { customer: true, loan: true, collectedBy: { select: { name: true } } },
      orderBy: { collectionDate: 'desc' },
    });
  }
}
