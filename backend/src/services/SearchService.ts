import { prisma } from '../config/prisma';
import { JwtPayload } from '../types';

export class SearchService {
  async search(query: string, user: JwtPayload) {
    const searchConditions = {
      contains: query,
    };

    const whereClause: any = { isDeleted: false };

    if (user.role === 'STAFF') {
      whereClause.assignedStaffId = user.userId;
    }

    const [customers, loans, collections, areas, users] = await Promise.all([
      prisma.customer.findMany({
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
      prisma.loan.findMany({
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
      prisma.collection.findMany({
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
      prisma.area.findMany({
        where: {
          isDeleted: false,
          OR: [
            { name: { contains: query } },
            { code: { contains: query } },
          ],
        },
        take: 10,
      }),
      prisma.user.findMany({
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
