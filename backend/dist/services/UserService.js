"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const UserRepository_1 = require("../repositories/UserRepository");
const AuditRepository_1 = require("../repositories/AuditRepository");
const errors_1 = require("../utils/errors");
const prisma_1 = require("../config/prisma");
const helpers_1 = require("../utils/helpers");
class UserService {
    constructor() {
        this.userRepo = new UserRepository_1.UserRepository();
        this.auditRepo = new AuditRepository_1.AuditRepository();
    }
    async createUser(data) {
        const existingEmail = await this.userRepo.findByEmail(data.email);
        if (existingEmail)
            throw new errors_1.ConflictError('Email already exists');
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 12);
        const user = await this.userRepo.create({
            email: data.email,
            password: hashedPassword,
            name: data.name,
            phone: data.phone,
            role: data.role,
            createdById: data.createdById,
        });
        if (data.areaIds && data.areaIds.length > 0) {
            await this.userRepo.assignAreas(user.id, data.areaIds);
        }
        await this.auditRepo.create({
            userId: data.createdById,
            action: 'CREATE',
            entity: 'User',
            entityId: user.id,
        });
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async updateUser(id, data, updatedById) {
        const user = await this.userRepo.findById(id);
        if (!user)
            throw new errors_1.NotFoundError('User not found');
        const oldValue = JSON.stringify({ role: user.role, name: user.name });
        const updated = await this.userRepo.update(id, {
            name: data.name,
            phone: data.phone,
            role: data.role,
        });
        if (data.areaIds) {
            await this.userRepo.assignAreas(id, data.areaIds);
        }
        await this.auditRepo.create({
            userId: updatedById,
            action: 'UPDATE',
            entity: 'User',
            entityId: id,
            oldValue,
            newValue: JSON.stringify(data),
        });
        const { password: _, ...userWithoutPassword } = updated;
        return userWithoutPassword;
    }
    async deleteUser(id, deletedById) {
        const user = await this.userRepo.findById(id);
        if (!user)
            throw new errors_1.NotFoundError('User not found');
        // Check if user has active loans (as collector, creator, or assigned staff)
        const activeLoans = await prisma_1.prisma.loan.findFirst({
            where: {
                status: 'ACTIVE',
                isDeleted: false,
                OR: [
                    { createdById: id },
                    { customer: { assignedStaffId: id } },
                    { collections: { some: { collectedById: id, isDeleted: false } } },
                ],
            },
        });
        if (activeLoans) {
            throw new errors_1.AppError('Cannot delete user: this user has active running loans. Close or transfer all associated loans first.', 400);
        }
        await this.userRepo.softDelete(id, deletedById);
        await this.auditRepo.create({
            userId: deletedById,
            action: 'DELETE',
            entity: 'User',
            entityId: id,
        });
    }
    async toggleUserStatus(id, status, updatedById) {
        const user = await this.userRepo.findById(id);
        if (!user)
            throw new errors_1.NotFoundError('User not found');
        await this.userRepo.updateStatus(id, status);
        await this.auditRepo.create({
            userId: updatedById,
            action: 'UPDATE',
            entity: 'User',
            entityId: id,
            oldValue: user.status,
            newValue: status,
        });
    }
    async lockUser(id, lockedById) {
        await this.userRepo.lockUser(id);
        await this.auditRepo.create({
            userId: lockedById,
            action: 'LOCK',
            entity: 'User',
            entityId: id,
        });
    }
    async unlockUser(id, unlockedById) {
        await this.userRepo.unlockUser(id);
        await this.auditRepo.create({
            userId: unlockedById,
            action: 'UNLOCK',
            entity: 'User',
            entityId: id,
        });
    }
    async getUsers(page, limit) {
        const { page: p, limit: l, skip } = (0, helpers_1.getPaginationParams)(page, limit);
        const { data, total } = await this.userRepo.findWithPagination({
            where: {},
            page: p,
            limit: l,
            include: { areas: { include: { area: true } } },
        });
        const usersWithoutPassword = data.map(({ password: _, ...rest }) => rest);
        return {
            data: usersWithoutPassword,
            pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) },
        };
    }
    async getUserById(id) {
        const user = await this.userRepo.findWithAreas(id);
        if (!user)
            throw new errors_1.NotFoundError('User not found');
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async getStaffList() {
        const { data } = await this.userRepo.findWithPagination({
            where: { role: 'STAFF' },
            page: 1,
            limit: 100,
            include: { areas: { include: { area: true } } },
        });
        return data.map(({ password: _, ...rest }) => rest);
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map