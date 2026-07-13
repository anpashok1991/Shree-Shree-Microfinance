"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class CustomerRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super('customer');
    }
    async findByCustomerId(customerId) {
        return this.findFirst({ customerId, isDeleted: false });
    }
    async findByAadhaar(aadhaarNumber) {
        return this.findFirst({ aadhaarNumber, isDeleted: false });
    }
    async findByMobile(mobile) {
        return this.findFirst({ mobile, isDeleted: false });
    }
    async search(query) {
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
    async findByUserId(userId) {
        return this.findFirst({ userId, isDeleted: false });
    }
    async findByArea(areaId) {
        return this.findAll({ where: { areaId, isDeleted: false } });
    }
    async findByStaff(staffId) {
        return this.findAll({ where: { assignedStaffId: staffId, isDeleted: false } });
    }
}
exports.CustomerRepository = CustomerRepository;
//# sourceMappingURL=CustomerRepository.js.map