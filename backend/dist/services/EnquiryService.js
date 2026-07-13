"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnquiryService = void 0;
const prisma_1 = require("../config/prisma");
class EnquiryService {
    async create(data) {
        return prisma_1.prisma.enquiry.create({ data });
    }
    async getAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            prisma_1.prisma.enquiry.findMany({ orderBy: { createdAt: 'desc' }, skip, take: limit }),
            prisma_1.prisma.enquiry.count(),
        ]);
        return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    async markRead(id) {
        return prisma_1.prisma.enquiry.update({ where: { id }, data: { isRead: true } });
    }
    async respond(id, response) {
        return prisma_1.prisma.enquiry.update({ where: { id }, data: { response } });
    }
}
exports.EnquiryService = EnquiryService;
//# sourceMappingURL=EnquiryService.js.map