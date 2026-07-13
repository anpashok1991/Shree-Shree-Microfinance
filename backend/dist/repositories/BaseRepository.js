"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const prisma_1 = require("../config/prisma");
class BaseRepository {
    constructor(model) {
        this.prisma = prisma_1.prisma;
        this.model = model;
    }
    get delegate() {
        return this.prisma[this.model];
    }
    async findAll(params) {
        return this.delegate.findMany({
            where: params?.where,
            include: params?.include,
            orderBy: params?.orderBy || { createdAt: 'desc' },
            skip: params?.skip,
            take: params?.take,
        });
    }
    async findById(id, include) {
        return this.delegate.findUnique({
            where: { id },
            include,
        });
    }
    async findFirst(where, include) {
        return this.delegate.findFirst({
            where,
            include,
        });
    }
    async create(data, include) {
        return this.delegate.create({ data, include });
    }
    async update(id, data, include) {
        return this.delegate.update({
            where: { id },
            data,
            include,
        });
    }
    async softDelete(id, deletedById) {
        return this.delegate.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                deletedById,
            },
        });
    }
    async hardDelete(id) {
        return this.delegate.delete({ where: { id } });
    }
    async count(where) {
        return this.delegate.count({ where });
    }
    async findWithPagination(params) {
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
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=BaseRepository.js.map