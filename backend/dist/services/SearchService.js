"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const prisma_1 = require("../config/prisma");
class SearchService {
    async search(query, user) {
        const searchConditions = {
            contains: query,
        };
        const whereClause = { isDeleted: false };
        if (user.role === 'STAFF') {
            whereClause.assignedStaffId = user.userId;
        }
        const [customers, loans, collections, areas, users] = await Promise.all([
            prisma_1.prisma.customer.findMany({
                where: {
                    ...whereClause,
                    OR: [
                        { name: searchConditions },
                        { mobile: { contains: query } },
                        { aadhaarNumber: { contains: query } },
                        { customerId: { contains: query } },
                    ],
                },
                take: 10,
                select: {
                    id: true,
                    customerId: true,
                    name: true,
                    mobile: true,
                    status: true,
                },
            }),
            prisma_1.prisma.loan.findMany({
                where: {
                    isDeleted: false,
                    OR: [
                        { loanNumber: { contains: query } },
                        { renewalNumber: { contains: query } },
                    ],
                },
                take: 10,
                select: {
                    id: true,
                    loanNumber: true,
                    amount: true,
                    status: true,
                    customer: { select: { name: true } },
                },
            }),
            prisma_1.prisma.collection.findMany({
                where: {
                    isDeleted: false,
                    collectionNo: { contains: query },
                },
                take: 10,
                select: {
                    id: true,
                    collectionNo: true,
                    amount: true,
                    customer: { select: { name: true } },
                },
            }),
            prisma_1.prisma.area.findMany({
                where: {
                    isDeleted: false,
                    OR: [
                        { name: { contains: query } },
                        { code: { contains: query } },
                    ],
                },
                take: 10,
            }),
            prisma_1.prisma.user.findMany({
                where: {
                    isDeleted: false,
                    OR: [
                        { name: { contains: query } },
                        { email: { contains: query } },
                        { phone: { contains: query } },
                    ],
                },
                take: 10,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            }),
        ]);
        return { customers, loans, collections, areas, users };
    }
}
exports.SearchService = SearchService;
//# sourceMappingURL=SearchService.js.map