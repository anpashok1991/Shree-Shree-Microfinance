import { prisma } from '../config/prisma';
import { CustomerRepository } from '../repositories/CustomerRepository';
import { AreaRepository } from '../repositories/AreaRepository';
import { LoanRepository } from '../repositories/LoanRepository';
import { NotFoundError, AppError, ConflictError } from '../utils/errors';
import { generateCustomerId } from '../utils/helpers';

export class BorrowerService {
  private customerRepo: CustomerRepository;
  private areaRepo: AreaRepository;
  private loanRepo: LoanRepository;

  constructor() {
    this.customerRepo = new CustomerRepository();
    this.areaRepo = new AreaRepository();
    this.loanRepo = new LoanRepository();
  }

  async getProfile(userId: string) {
    const customer = await this.customerRepo.findByUserId(userId);
    if (!customer) return null;
    return this.customerRepo.findById(customer.id, {
      area: true,
    });
  }

  async createOrUpdateProfile(
    userId: string,
    data: {
      name: string;
      fatherName: string;
      mobile: string;
      address: string;
      village: string;
      district: string;
      state: string;
      pinCode: string;
      occupation: string;
      aadhaarNumber?: string;
      monthlyIncome?: number;
    }
  ) {
    const existing = await this.customerRepo.findByUserId(userId);

    if (existing) {
      const updated = await this.customerRepo.update(existing.id, {
        name: data.name,
        fatherName: data.fatherName,
        mobile: data.mobile,
        address: data.address,
        village: data.village,
        district: data.district,
        state: data.state,
        pinCode: data.pinCode,
        occupation: data.occupation,
        ...(data.aadhaarNumber && !data.aadhaarNumber.startsWith('TEMP-') ? { aadhaarNumber: data.aadhaarNumber } : {}),
        ...(data.monthlyIncome !== undefined ? { monthlyIncome: Number(data.monthlyIncome) } : {}),
      });
      return this.customerRepo.findById(updated.id, { area: true });
    }

    const existingAadhaar = data.aadhaarNumber
      ? await this.customerRepo.findByAadhaar(data.aadhaarNumber)
      : null;
    if (existingAadhaar) throw new ConflictError('Aadhaar number already in use');

    const existingMobile = await this.customerRepo.findByMobile(data.mobile);
    if (existingMobile) throw new ConflictError('Mobile number already in use');

    let area = await this.areaRepo.findFirst({ isDeleted: false });
    if (!area) {
      area = await this.areaRepo.create({ name: 'General', code: `GEN-${Date.now()}` });
    }

    const customerId = generateCustomerId();
    const customer = await this.customerRepo.create({
      customerId,
      name: data.name,
      fatherName: data.fatherName,
      mobile: data.mobile,
      aadhaarNumber: data.aadhaarNumber || `TEMP-${Date.now()}`,
      address: data.address || '',
      village: data.village || '',
      district: data.district || '',
      state: data.state || '',
      pinCode: data.pinCode || '',
      occupation: data.occupation || '',
      ...(data.monthlyIncome !== undefined ? { monthlyIncome: data.monthlyIncome } : {}),
      areaId: area.id,
      createdById: userId,
      userId,
      status: 'PENDING',
    });

    return this.customerRepo.findById(customer.id, { area: true });
  }

  async getLoanDetail(userId: string, loanId: string) {
    const customer = await this.customerRepo.findByUserId(userId);
    if (!customer) throw new NotFoundError('Customer profile not found');

    const loan = await this.loanRepo.getLoanHistory(loanId);
    if (!loan || loan.customerId !== customer.id) throw new NotFoundError('Loan not found');

    return loan;
  }
}
