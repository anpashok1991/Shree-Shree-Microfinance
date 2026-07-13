import { PrismaClient } from '@prisma/client';
export declare class BaseRepository<T extends Record<string, any>> {
    protected prisma: PrismaClient;
    protected model: string;
    constructor(model: string);
    protected get delegate(): any;
    findAll(params?: {
        where?: any;
        include?: any;
        orderBy?: any;
        skip?: number;
        take?: number;
    }): Promise<T[]>;
    findById(id: string, include?: any): Promise<T | null>;
    findFirst(where: any, include?: any): Promise<T | null>;
    create(data: any, include?: any): Promise<T>;
    update(id: string, data: any, include?: any): Promise<T>;
    softDelete(id: string, deletedById: string): Promise<T>;
    hardDelete(id: string): Promise<T>;
    count(where?: any): Promise<number>;
    findWithPagination(params: {
        where?: any;
        include?: any;
        orderBy?: any;
        page: number;
        limit: number;
    }): Promise<{
        data: T[];
        total: number;
    }>;
}
//# sourceMappingURL=BaseRepository.d.ts.map