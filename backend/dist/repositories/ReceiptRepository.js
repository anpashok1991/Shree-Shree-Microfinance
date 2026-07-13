"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class ReceiptRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super('receipt');
    }
    async findByLoan(loanId) {
        return this.findAll({
            where: { loanId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByCustomer(customerId) {
        return this.findAll({
            where: { customerId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByReceiptNo(receiptNo) {
        return this.delegate.findUnique({ where: { receiptNo } });
    }
}
exports.ReceiptRepository = ReceiptRepository;
//# sourceMappingURL=ReceiptRepository.js.map