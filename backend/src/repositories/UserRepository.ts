import { BaseRepository } from './BaseRepository';
import { User } from '@prisma/client';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('user');
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.delegate.findUnique({ where: { email } });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.findFirst({ phone, isDeleted: false });
  }

  async updateLoginAttempts(id: string, attempts: number): Promise<User> {
    return this.update(id, { loginAttempts: attempts });
  }

  async lockUser(id: string): Promise<User> {
    return this.update(id, { isLocked: true });
  }

  async unlockUser(id: string): Promise<User> {
    return this.update(id, { isLocked: false, loginAttempts: 0 });
  }

  async updatePassword(id: string, hashedPassword: string): Promise<User> {
    return this.update(id, { password: hashedPassword });
  }

  async updateStatus(id: string, status: 'ACTIVE' | 'INACTIVE'): Promise<User> {
    return this.update(id, { status });
  }

  async findWithAreas(id: string): Promise<User | null> {
    return this.delegate.findUnique({
      where: { id },
      include: { areas: { include: { area: true } } },
    });
  }

  async assignAreas(userId: string, areaIds: string[]): Promise<void> {
    await this.prisma.userArea.deleteMany({ where: { userId } });
    await this.prisma.userArea.createMany({
      data: areaIds.map((areaId) => ({ userId, areaId })),
    });
  }
}
