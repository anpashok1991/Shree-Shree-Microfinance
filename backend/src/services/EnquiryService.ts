import { prisma } from '../config/prisma';

export class EnquiryService {
  async create(data: { name: string; email: string; phone: string; message: string }) {
    return prisma.enquiry.create({ data });
  }

  async getAll(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.enquiry.findMany({ orderBy: { createdAt: 'desc' }, skip, take: limit }),
      prisma.enquiry.count(),
    ]);
    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async markRead(id: string) {
    return prisma.enquiry.update({ where: { id }, data: { isRead: true } });
  }

  async respond(id: string, response: string) {
    return prisma.enquiry.update({ where: { id }, data: { response } });
  }
}
