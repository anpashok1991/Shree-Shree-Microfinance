"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const CustomerRepository_1 = require("../repositories/CustomerRepository");
const LoanRepository_1 = require("../repositories/LoanRepository");
const CollectionRepository_1 = require("../repositories/CollectionRepository");
const AuditRepository_1 = require("../repositories/AuditRepository");
const errors_1 = require("../utils/errors");
const helpers_1 = require("../utils/helpers");
class CustomerService {
    constructor() {
        this.customerRepo = new CustomerRepository_1.CustomerRepository();
        this.loanRepo = new LoanRepository_1.LoanRepository();
        this.collectionRepo = new CollectionRepository_1.CollectionRepository();
        this.auditRepo = new AuditRepository_1.AuditRepository();
    }
    async createCustomer(data) {
        const existingAadhaar = await this.customerRepo.findByAadhaar(data.aadhaarNumber);
        if (existingAadhaar)
            throw new errors_1.ConflictError('Aadhaar number already exists');
        const existingMobile = await this.customerRepo.findByMobile(data.mobile);
        if (existingMobile)
            throw new errors_1.ConflictError('Mobile number already exists');
        const customerId = (0, helpers_1.generateCustomerId)();
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
    async updateCustomer(id, data, updatedById) {
        const customer = await this.customerRepo.findById(id);
        if (!customer)
            throw new errors_1.NotFoundError('Customer not found');
        if (data.aadhaarNumber && data.aadhaarNumber !== customer.aadhaarNumber) {
            const existing = await this.customerRepo.findByAadhaar(data.aadhaarNumber);
            if (existing)
                throw new errors_1.ConflictError('Aadhaar number already in use');
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
    async deleteCustomer(id, deletedById) {
        const customer = await this.customerRepo.findById(id);
        if (!customer)
            throw new errors_1.NotFoundError('Customer not found');
        await this.customerRepo.softDelete(id, deletedById);
        await this.auditRepo.create({
            userId: deletedById,
            action: 'DELETE',
            entity: 'Customer',
            entityId: id,
        });
    }
    async getCustomers(page, limit, areaId, staffId) {
        const { page: p, limit: l, skip } = (0, helpers_1.getPaginationParams)(page, limit);
        const where = {};
        if (areaId)
            where.areaId = areaId;
        if (staffId)
            where.assignedStaffId = staffId;
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
    async getCustomerById(id) {
        const customer = await this.customerRepo.findById(id, {
            area: true,
            assignedStaff: { select: { id: true, name: true, email: true } },
            createdBy: { select: { id: true, name: true } },
            loans: {
                orderBy: { createdAt: 'desc' },
                include: { collections: { take: 5, orderBy: { collectionDate: 'desc' } } },
            },
        });
        if (!customer)
            throw new errors_1.NotFoundError('Customer not found');
        return customer;
    }
    async searchCustomers(query) {
        return this.customerRepo.search(query);
    }
    async getCustomerByCustomerId(customerId) {
        const customer = await this.customerRepo.findByCustomerId(customerId);
        if (!customer)
            throw new errors_1.NotFoundError('Customer not found');
        return customer;
    }
}
exports.CustomerService = CustomerService;
//# sourceMappingURL=CustomerService.js.map