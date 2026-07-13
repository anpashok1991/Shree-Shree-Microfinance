import { PrismaClient } from '@prisma/client';
import { prisma } from '../config/prisma';

export class BaseRepository<T extends Record<string, any>> {
  protected prisma: PrismaClient;
  protected model: string;

  constructor(model: string) {
    this.prisma = prisma;
    this.model = model;
  }

  protected get delegate(): any {
    return (this.prisma as any)[this.model];
  }

  async findAll(params?: {
    where?: any;
    include?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
  }): Promise<T[]> {
    return this.delegate.findMany({
      where: params?.where,
      include: params?.include,
      orderBy: params?.orderBy || { createdAt: 'desc' },
      skip: params?.skip,
      take: params?.take,
    });
  }

  async findById(id: string, include?: any): Promise<T | null> {
    return this.delegate.findUnique({
      where: { id },
      include,
    });
  }

  async findFirst(where: any, include?: any): Promise<T | null> {
    return this.delegate.findFirst({
      where,
      include,
    });
  }

  async create(data: any, include?: any): Promise<T> {
    return this.delegate.create({ data, include });
  }

  async update(id: string, data: any, include?: any): Promise<T> {
    return this.delegate.update({
      where: { id },
      data,
      include,
    });
  }

  async softDelete(id: string, deletedById: string): Promise<T> {
    return this.delegate.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedById,
      },
    });
  }

  async hardDelete(id: string): Promise<T> {
    return this.delegate.delete({ where: { id } });
  }

  async count(where?: any): Promise<number> {
    return this.delegate.count({ where });
  }

  async findWithPagination(params: {
    where?: any;
    include?: any;
    orderBy?: any;
    page: number;
    limit: number;
  }): Promise<{ data: T[]; total: number }> {
    const { where, include, orderBy, page, limit } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.delegate.findMany({
        where,
        include,
        orderBy: orderBy || { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.delegate.count({ where }),
    ]);

    return { data, total };
  }
}
