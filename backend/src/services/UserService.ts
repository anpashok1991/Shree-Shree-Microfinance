import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/UserRepository';
import { AuditRepository } from '../repositories/AuditRepository';
import { NotFoundError, ConflictError, AppError } from '../utils/errors';
import { prisma } from '../config/prisma';
import { getPaginationParams } from '../utils/helpers';

export class UserService {
  private userRepo: UserRepository;
  private auditRepo: AuditRepository;

  constructor() {
    this.userRepo = new UserRepository();
    this.auditRepo = new AuditRepository();
  }

  async createUser(data: {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: string;
    areaIds?: string[];
    createdById: string;
  }) {
    const existingEmail = await this.userRepo.findByEmail(data.email);
    if (existingEmail) throw new ConflictError('Email already exists');

    const hashedPassword = await bcrypt.hash(data.password, 12);

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

  async updateUser(id: string, data: Partial<{
    name: string;
    phone: string;
    role: string;
    areaIds: string[];
  }>, updatedById: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundError('User not found');

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

  async deleteUser(id: string, deletedById: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundError('User not found');

    // Check if user has active loans (as collector, creator, or assigned staff)
    const activeLoans = await prisma.loan.findFirst({
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
      throw new AppError(
        'Cannot delete user: this user has active running loans. Close or transfer all associated loans first.',
        400
      );
    }

    await this.userRepo.softDelete(id, deletedById);

    await this.auditRepo.create({
      userId: deletedById,
      action: 'DELETE',
      entity: 'User',
      entityId: id,
    });
  }

  async toggleUserStatus(id: string, status: 'ACTIVE' | 'INACTIVE', updatedById: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundError('User not found');

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

  async lockUser(id: string, lockedById: string) {
    await this.userRepo.lockUser(id);
    await this.auditRepo.create({
      userId: lockedById,
      action: 'LOCK',
      entity: 'User',
      entityId: id,
    });
  }

  async unlockUser(id: string, unlockedById: string) {
    await this.userRepo.unlockUser(id);
    await this.auditRepo.create({
      userId: unlockedById,
      action: 'UNLOCK',
      entity: 'User',
      entityId: id,
    });
  }

  async getUsers(page?: number, limit?: number) {
    const { page: p, limit: l, skip } = getPaginationParams(page, limit);
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

  async getUserById(id: string) {
    const user = await this.userRepo.findWithAreas(id);
    if (!user) throw new NotFoundError('User not found');
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
