"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowerService = void 0;
const CustomerRepository_1 = require("../repositories/CustomerRepository");
const AreaRepository_1 = require("../repositories/AreaRepository");
const LoanRepository_1 = require("../repositories/LoanRepository");
const errors_1 = require("../utils/errors");
const helpers_1 = require("../utils/helpers");
class BorrowerService {
    constructor() {
        this.customerRepo = new CustomerRepository_1.CustomerRepository();
        this.areaRepo = new AreaRepository_1.AreaRepository();
        this.loanRepo = new LoanRepository_1.LoanRepository();
    }
    async getProfile(userId) {
        const customer = await this.customerRepo.findByUserId(userId);
        if (!customer)
            return null;
        return this.customerRepo.findById(customer.id, {
            area: true,
        });
    }
    async createOrUpdateProfile(userId, data) {
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
        if (existingAadhaar)
            throw new errors_1.ConflictError('Aadhaar number already in use');
        const existingMobile = await this.customerRepo.findByMobile(data.mobile);
        if (existingMobile)
            throw new errors_1.ConflictError('Mobile number already in use');
        let area = await this.areaRepo.findFirst({ isDeleted: false });
        if (!area) {
            area = await this.areaRepo.create({ name: 'General', code: `GEN-${Date.now()}` });
        }
        const customerId = (0, helpers_1.generateCustomerId)();
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
    async getLoanDetail(userId, loanId) {
        const customer = await this.customerRepo.findByUserId(userId);
        if (!customer)
            throw new errors_1.NotFoundError('Customer profile not found');
        const loan = await this.loanRepo.getLoanHistory(loanId);
        if (!loan || loan.customerId !== customer.id)
            throw new errors_1.NotFoundError('Loan not found');
        return loan;
    }
}
exports.BorrowerService = BorrowerService;
//# sourceMappingURL=BorrowerService.js.map