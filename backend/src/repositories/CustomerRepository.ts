import { BaseRepository } from './BaseRepository';
import { Customer } from '@prisma/client';

export class CustomerRepository extends BaseRepository<Customer> {
  constructor() {
    super('customer');
  }

  async findByCustomerId(customerId: string): Promise<Customer | null> {
    return this.findFirst({ customerId, isDeleted: false });
  }

  async findByAadhaar(aadhaarNumber: string): Promise<Customer | null> {
    return this.findFirst({ aadhaarNumber, isDeleted: false });
  }

  async findByMobile(mobile: string): Promise<Customer | null> {
    return this.findFirst({ mobile, isDeleted: false });
  }

  async search(query: string): Promise<Customer[]> {
    return this.delegate.findMany({
      where: {
        isDeleted: false,
        OR: [
          { name: { contains: query } },
          { mobile: { contains: query } },
          { aadhaarNumber: { contains: query } },
          { customerId: { contains: query } },
        ],
      },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUserId(userId: string): Promise<Customer | null> {
    return this.findFirst({ userId, isDeleted: false });
  }

  async findByArea(areaId: string): Promise<Customer[]> {
    return this.findAll({ where: { areaId, isDeleted: false } });
  }

  async findByStaff(staffId: string): Promise<Customer[]> {
    return this.findAll({ where: { assignedStaffId: staffId, isDeleted: false } });
  }
}
