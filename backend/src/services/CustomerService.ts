import { CustomerRepository } from '../repositories/CustomerRepository';
import { LoanRepository } from '../repositories/LoanRepository';
import { CollectionRepository } from '../repositories/CollectionRepository';
import { AuditRepository } from '../repositories/AuditRepository';
import { NotFoundError, ConflictError } from '../utils/errors';
import { generateCustomerId, getPaginationParams } from '../utils/helpers';


export class CustomerService {
  private customerRepo: CustomerRepository;
  private loanRepo: LoanRepository;
  private collectionRepo: CollectionRepository;
  private auditRepo: AuditRepository;

  constructor() {
    this.customerRepo = new CustomerRepository();
    this.loanRepo = new LoanRepository();
    this.collectionRepo = new CollectionRepository();
    this.auditRepo = new AuditRepository();
  }

  async createCustomer(data: {
    name: string;
    fatherName: string;
    mobile: string;
    alternateMobile?: string;
    aadhaarNumber: string;
    panNumber?: string;
    address: string;
    village: string;
    district: string;
    state: string;
    pinCode: string;
    occupation: string;
    monthlyIncome?: number;
    guarantorName?: string;
    guarantorMobile?: string;
    guarantorAadhaar?: string;
    areaId: string;
    assignedStaffId?: string;
    createdById: string;
  }) {
    const existingAadhaar = await this.customerRepo.findByAadhaar(data.aadhaarNumber);
    if (existingAadhaar) throw new ConflictError('Aadhaar number already exists');

    const existingMobile = await this.customerRepo.findByMobile(data.mobile);
    if (existingMobile) throw new ConflictError('Mobile number already exists');

    const customerId = generateCustomerId();

    const customer = await this.customerRepo.create({
      ...data,
      customerId,
      status: 'PENDING',
    });

    await this.auditRepo.create({
      userId: data.createdById,
      action: 'CREATE',
      entity: 'Customer',
      entityId: customer.id,
    });

    return customer;
  }

  async updateCustomer(id: string, data: Partial<{
    name: string;
    fatherName: string;
    mobile: string;
    alternateMobile: string;
    aadhaarNumber: string;
    panNumber: string;
    address: string;
    village: string;
    district: string;
    state: string;
    pinCode: string;
    occupation: string;
    monthlyIncome: number;
    guarantorName: string;
    guarantorMobile: string;
    guarantorAadhaar: string;
    areaId: string;
    assignedStaffId: string;
    status: string;
  }>, updatedById: string) {
    const customer = await this.customerRepo.findById(id);
    if (!customer) throw new NotFoundError('Customer not found');

    if (data.aadhaarNumber && data.aadhaarNumber !== customer.aadhaarNumber) {
      const existing = await this.customerRepo.findByAadhaar(data.aadhaarNumber);
      if (existing) throw new ConflictError('Aadhaar number already in use');
    }

    const updated = await this.customerRepo.update(id, {
      ...data,
      status: data.status || customer.status,
    });

    await this.auditRepo.create({
      userId: updatedById,
      action: 'UPDATE',
      entity: 'Customer',
      entityId: id,
    });

    return updated;
  }

  async deleteCustomer(id: string, deletedById: string) {
    const customer = await this.customerRepo.findById(id);
    if (!customer) throw new NotFoundError('Customer not found');

    await this.customerRepo.softDelete(id, deletedById);

    await this.auditRepo.create({
      userId: deletedById,
      action: 'DELETE',
      entity: 'Customer',
      entityId: id,
    });
  }

  async getCustomers(page?: number, limit?: number, areaId?: string, staffId?: string) {
    const { page: p, limit: l, skip } = getPaginationParams(page, limit);

    const where: any = {};
    if (areaId) where.areaId = areaId;
    if (staffId) where.assignedStaffId = staffId;

    const { data, total } = await this.customerRepo.findWithPagination({
      where,
      page: p,
      limit: l,
      include: {
        area: true,
        assignedStaff: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true } },
      },
    });

    return {
      data,
      pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) },
    };
  }

  async getCustomerById(id: string) {
    const customer = await this.customerRepo.findById(id, {
      area: true,
      assignedStaff: { select: { id: true, name: true, email: true } },
      createdBy: { select: { id: true, name: true } },
      loans: {
        orderBy: { createdAt: 'desc' },
        include: { collections: { take: 5, orderBy: { collectionDate: 'desc' } } },
      },
    });
    if (!customer) throw new NotFoundError('Customer not found');
    return customer;
  }

  async searchCustomers(query: string) {
    return this.customerRepo.search(query);
  }

  async getCustomerByCustomerId(customerId: string) {
    const customer = await this.customerRepo.findByCustomerId(customerId);
    if (!customer) throw new NotFoundError('Customer not found');
    return customer;
  }
}
