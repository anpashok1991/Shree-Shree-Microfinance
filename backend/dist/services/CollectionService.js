"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionService = void 0;
const CollectionRepository_1 = require("../repositories/CollectionRepository");
const LoanRepository_1 = require("../repositories/LoanRepository");
const CustomerRepository_1 = require("../repositories/CustomerRepository");
const ReceiptRepository_1 = require("../repositories/ReceiptRepository");
const AuditRepository_1 = require("../repositories/AuditRepository");
const errors_1 = require("../utils/errors");
const helpers_1 = require("../utils/helpers");
const prisma_1 = require("../config/prisma");
class CollectionService {
    constructor() {
        this.collectionRepo = new CollectionRepository_1.CollectionRepository();
        this.loanRepo = new LoanRepository_1.LoanRepository();
        this.customerRepo = new CustomerRepository_1.CustomerRepository();
        this.receiptRepo = new ReceiptRepository_1.ReceiptRepository();
        this.auditRepo = new AuditRepository_1.AuditRepository();
    }
    async recordCollection(data) {
        const loan = await this.loanRepo.findById(data.loanId, { customer: { select: { areaId: true } } });
        if (!loan)
            throw new errors_1.NotFoundError('Loan not found');
        if (loan.status !== 'ACTIVE') {
            throw new errors_1.AppError('Loan is not active', 400);
        }
        // STAFF can only collect for loans in their assigned areas
        if (data.collectedByRole === 'STAFF') {
            const userAreas = await prisma_1.prisma.userArea.findMany({ where: { userId: data.collectedById }, select: { areaId: true } });
            const areaIds = userAreas.map(ua => ua.areaId);
            if (areaIds.length > 0 && !areaIds.includes(loan.customer.areaId)) {
                throw new errors_1.AppError('You can only collect payments for loans in your assigned area', 403);
            }
        }
        const newTotalPaid = loan.totalPaid + data.amount;
        const newOutstanding = Math.max(0, loan.outstanding - data.amount);
        const collectionNo = (0, helpers_1.generateCollectionNo)();
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
        const receiptNo = (0, helpers_1.generateReceiptNo)();
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
    async getCollections(page, limit, loanId, staffId, startDate, endDate) {
        const { page: p, limit: l, skip } = (0, helpers_1.getPaginationParams)(page, limit);
        const where = {};
        if (loanId)
            where.loanId = loanId;
        if (staffId) {
            const userAreas = await prisma_1.prisma.userArea.findMany({ where: { userId: staffId }, select: { areaId: true } });
            const areaIds = userAreas.map(ua => ua.areaId);
            if (areaIds.length > 0) {
                where.customer = { areaId: { in: areaIds } };
            }
            else {
                where.id = null;
            }
        }
        if (startDate || endDate) {
            where.collectionDate = {};
            if (startDate)
                where.collectionDate.gte = startDate;
            if (endDate)
                where.collectionDate.lte = endDate;
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
    async voidCollection(collectionId, voidedById) {
        const collection = await this.collectionRepo.findById(collectionId, { loan: true });
        if (!collection)
            throw new errors_1.NotFoundError('Collection not found');
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
    async getStaffCollectionReport(staffId, startDate, endDate) {
        return this.collectionRepo.findAll({
            where: {
                collectedById: staffId,
                collectionDate: { gte: startDate, lte: endDate },
            },
            include: { customer: true, loan: true },
            orderBy: { collectionDate: 'desc' },
        });
    }
    async getAreaCollectionReport(areaId, startDate, endDate) {
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
exports.CollectionService = CollectionService;
//# sourceMappingURL=CollectionService.js.map