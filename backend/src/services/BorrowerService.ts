import { prisma } from '../config/prisma';
import { CustomerRepository } from '../repositories/CustomerRepository';
import { AreaRepository } from '../repositories/AreaRepository';
import { NotFoundError, AppError, ConflictError } from '../utils/errors';
import { generateCustomerId } from '../utils/helpers';

export class BorrowerService {
  private customerRepo: CustomerRepository;
  private areaRepo: AreaRepository;

  constructor() {
    this.customerRepo = new CustomerRepository();
    this.areaRepo = new AreaRepository();
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
        ...(data.aadhaarNumber ? { aadhaarNumber: data.aadhaarNumber } : {}),
        ...(data.monthlyIncome !== undefined ? { monthlyIncome: data.monthlyIncome } : {}),
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
}
