import { LoanRepository } from '../repositories/LoanRepository';
import { CustomerRepository } from '../repositories/CustomerRepository';
import { AuditRepository } from '../repositories/AuditRepository';
import { SettingsRepository } from '../repositories/SettingsRepository';
import { NotFoundError, AppError } from '../utils/errors';
import { prisma } from '../config/prisma';
import {
  generateLoanNumber,
  generateRenewalNumber,
  calculateLoanDetails,
  calculateRenewal,
  getPaginationParams,
} from '../utils/helpers';


export class LoanService {
  private loanRepo: LoanRepository;
  private customerRepo: CustomerRepository;
  private auditRepo: AuditRepository;
  private settingsRepo: SettingsRepository;

  constructor() {
    this.loanRepo = new LoanRepository();
    this.customerRepo = new CustomerRepository();
    this.auditRepo = new AuditRepository();
    this.settingsRepo = new SettingsRepository();
  }

  async createLoan(data: {
    customerId: string;
    amount: number;
    createdById: string;
  }) {
    const customer = await this.customerRepo.findById(data.customerId);
    if (!customer) throw new NotFoundError('Customer not found');

    const maxLoan = await this.settingsRepo.getNumberValue('max_loan', 50000);
    if (data.amount > maxLoan) {
      throw new AppError(`Loan amount cannot exceed ₹${maxLoan}`, 400);
    }

    const fileChargePercent = await this.settingsRepo.getNumberValue('file_charge_percent', 3);
    const tenure = await this.settingsRepo.getNumberValue('loan_tenure_days', 100);

    const calculation = calculateLoanDetails(data.amount, fileChargePercent, tenure);
    const loanNumber = generateLoanNumber();

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

  async approveLoan(loanId: string, approvedById: string) {
    const loan = await this.loanRepo.findById(loanId);
    if (!loan) throw new NotFoundError('Loan not found');
    if (loan.status !== 'PENDING_APPROVAL') {
      throw new AppError('Loan is not pending approval', 400);
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

  async rejectLoan(loanId: string, reason: string, rejectedById: string) {
    const loan = await this.loanRepo.findById(loanId);
    if (!loan) throw new NotFoundError('Loan not found');

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

  async returnLoan(loanId: string, reason: string, returnedById: string) {
    const loan = await this.loanRepo.findById(loanId);
    if (!loan) throw new NotFoundError('Loan not found');

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

  async getLoans(
    page?: number,
    limit?: number,
    status?: string,
    customerId?: string,
    staffId?: string
  ) {
    const { page: p, limit: l, skip } = getPaginationParams(page, limit);

    const where: any = {};
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;
    if (staffId) where.createdById = staffId;

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

  async getLoanDetails(loanId: string) {
    const loan = await this.loanRepo.getLoanHistory(loanId);
    if (!loan) throw new NotFoundError('Loan not found');
    const foreclosureChargePercent = await this.settingsRepo.getNumberValue('foreclosure_charge_percent', 0);
    return { ...loan, foreclosureChargePercent };
  }

  async forecloseLoan(loanId: string, foreclosedById: string) {
    const loan = await this.loanRepo.findById(loanId);
    if (!loan) throw new NotFoundError('Loan not found');
    if (loan.status !== 'ACTIVE') throw new AppError('Only active loans can be foreclosed', 400);
    if (loan.outstanding <= 0) throw new AppError('Loan has no outstanding balance', 400);

    const foreclosureChargePercent = await this.settingsRepo.getNumberValue('foreclosure_charge_percent', 0);
    const charge = (loan.outstanding * foreclosureChargePercent) / 100;
    const totalPayment = loan.outstanding + charge;

    const updated = await this.loanRepo.update(loanId, {
      status: 'CLOSED',
      outstanding: 0,
      totalPaid: loan.totalPaid + loan.outstanding,
      closedAt: new Date(),
    });

    await this.auditRepo.create({
      userId: foreclosedById,
      action: 'FORECLOSE',
      entity: 'Loan',
      entityId: loanId,
      oldValue: JSON.stringify({ outstanding: loan.outstanding, status: loan.status }),
      newValue: JSON.stringify({ outstanding: 0, status: 'CLOSED', charge, totalPayment }),
    });

    return { ...updated, foreclosureCharge: charge, totalPayment };
  }

  async renewLoan(loanId: string, renewedById: string) {
    const loan = await this.loanRepo.findById(loanId);
    if (!loan) throw new NotFoundError('Loan not found');

    if (loan.outstanding <= 0) {
      throw new AppError('Loan has no outstanding balance', 400);
    }

    const renewalChargePercent = await this.settingsRepo.getNumberValue('renewal_charge_percent', 20);
    const { renewalCharge, newLoanAmount } = calculateRenewal(
      loan.outstanding,
      renewalChargePercent
    );

    const fileChargePercent = await this.settingsRepo.getNumberValue('file_charge_percent', 3);
    const tenure = await this.settingsRepo.getNumberValue('loan_tenure_days', 100);
    const calculation = calculateLoanDetails(newLoanAmount, fileChargePercent, tenure);
    const renewalNumber = generateRenewalNumber(loan.loanNumber);
    const newLoanNumber = generateLoanNumber();

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

  async borrowerApply(userId: string, data: { amount: number; purpose?: string }) {
    const customer = await this.customerRepo.findByUserId(userId);
    if (!customer) throw new AppError('Please create your profile first.', 400);

    return this.createLoan({
      customerId: customer.id,
      amount: data.amount,
      createdById: userId,
    });
  }

  async updateLoan(loanId: string, data: { amount?: number; status?: string }, updatedById: string) {
    const loan = await this.loanRepo.findById(loanId);
    if (!loan) throw new NotFoundError('Loan not found');

    const allowedStatuses = ['PENDING_APPROVAL', 'RETURNED'];
    if (!allowedStatuses.includes(loan.status)) {
      throw new AppError('Loan can only be edited when pending approval or returned', 400);
    }

    const updateData: any = {};
    if (data.amount && data.amount !== loan.amount) {
      const maxLoan = await this.settingsRepo.getNumberValue('max_loan', 50000);
      if (data.amount > maxLoan) {
        throw new AppError(`Loan amount cannot exceed ₹${maxLoan}`, 400);
      }
      const fileChargePercent = await this.settingsRepo.getNumberValue('file_charge_percent', 3);
      const tenure = await this.settingsRepo.getNumberValue('loan_tenure_days', 100);
      const calculation = calculateLoanDetails(data.amount, fileChargePercent, tenure);
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

  async findCustomerByUserId(userId: string) {
    return this.customerRepo.findByUserId(userId);
  }

  async findCustomerByUserIdOrEmail(userId: string, email: string) {
    let customer = await this.customerRepo.findByUserId(userId);
    if (!customer) {
      // fallback: try to find customer by matching email/name
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        customer = await this.customerRepo.findFirst({
          mobile: user.phone,
          isDeleted: false,
        });
      }
    }
    return customer;
  }

  async calculateLoanAmount(amount: number) {
    const fileChargePercent = await this.settingsRepo.getNumberValue('file_charge_percent', 3);
    const tenure = await this.settingsRepo.getNumberValue('loan_tenure_days', 100);
    return calculateLoanDetails(amount, fileChargePercent, tenure);
  }

  async getActiveLoansByStaff(staffId: string) {
    return this.loanRepo.findAll({
      where: {
        status: 'ACTIVE',
        customer: { assignedStaffId: staffId },
      },
      include: { customer: true },
    });
  }

  async getActiveLoansByArea(areaId: string) {
    return this.loanRepo.findAll({
      where: {
        status: 'ACTIVE',
        customer: { areaId },
      },
      include: { customer: true },
    });
  }

  async generateNoc(loanId: string) {
    const loan = await this.loanRepo.getLoanHistory(loanId);
    if (!loan) throw new NotFoundError('Loan not found');
    if (loan.status !== 'CLOSED') throw new AppError('NOC is only available for closed loans', 400);

    const companyName = await this.settingsRepo.getValue('company_name', 'Shree Shree Group');
    const companyAddress = await this.settingsRepo.getValue('company_address', '');

    return {
      companyName,
      companyAddress,
      nocNumber: `NOC-${loan.loanNumber}-${loan.closedAt ? new Date(loan.closedAt).toISOString().slice(0, 10).replace(/-/g, '') : Date.now()}`,
      loanNumber: loan.loanNumber,
      customerName: loan.customer?.name || '',
      customerAddress: [loan.customer?.address, loan.customer?.village, loan.customer?.district, loan.customer?.state].filter(Boolean).join(', '),
      loanAmount: loan.amount,
      disbursedAmount: loan.disbursedAmount,
      totalPaid: loan.totalPaid,
      loanStartDate: loan.startDate,
      loanClosedDate: loan.closedAt,
      issuedDate: new Date(),
    };
  }
}
