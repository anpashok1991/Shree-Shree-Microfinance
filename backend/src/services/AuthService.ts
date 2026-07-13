import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { config } from '../config';
import { UserRepository } from '../repositories/UserRepository';
import { AuditRepository } from '../repositories/AuditRepository';
import { CustomerRepository } from '../repositories/CustomerRepository';
import { AreaRepository } from '../repositories/AreaRepository';
import { UnauthorizedError, AppError, ConflictError } from '../utils/errors';
import { JwtPayload } from '../types';
import { generateCustomerId } from '../utils/helpers';


export class AuthService {
  private userRepo: UserRepository;
  private auditRepo: AuditRepository;
  private customerRepo: CustomerRepository;
  private areaRepo: AreaRepository;

  constructor() {
    this.userRepo = new UserRepository();
    this.auditRepo = new AuditRepository();
    this.customerRepo = new CustomerRepository();
    this.areaRepo = new AreaRepository();
  }

  async login(email: string, password: string, ipAddress?: string, userAgent?: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (user.status === 'INACTIVE') {
      throw new UnauthorizedError('Account is inactive. Contact admin.');
    }

    if (user.isLocked) {
      throw new UnauthorizedError('Account is locked. Contact admin.');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      const attempts = user.loginAttempts + 1;
      if (attempts >= 5) {
        await this.userRepo.lockUser(user.id);
        throw new UnauthorizedError('Account locked due to multiple failed attempts');
      }
      await this.userRepo.updateLoginAttempts(user.id, attempts);
      throw new UnauthorizedError('Invalid credentials');
    }

    await this.userRepo.update(user.id, {
      loginAttempts: 0,
      lastLogin: new Date(),
    });

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as any);

    await this.auditRepo.create({
      userId: user.id,
      action: 'LOGIN',
      entity: 'User',
      entityId: user.id,
      ipAddress,
      userAgent,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new UnauthorizedError('User not found');

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) throw new UnauthorizedError('Current password is incorrect');

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await this.userRepo.updatePassword(userId, hashedPassword);
  }

  async register(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    address?: string;
    aadhaarNumber?: string;
  }) {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) throw new ConflictError('Email already registered');

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: hashedPassword,
          role: 'BORROWER',
        },
      });

      let area = await tx.area.findFirst({ where: { isDeleted: false } });
      if (!area) {
        area = await tx.area.create({
          data: { name: 'General', code: `GEN-${Date.now()}` },
        });
      }

      const customerId = generateCustomerId();
      await tx.customer.create({
        data: {
          customerId,
          name: data.name,
          fatherName: '',
          mobile: data.phone,
          aadhaarNumber: data.aadhaarNumber || `TEMP-${Date.now()}`,
          address: data.address || '',
          village: '',
          district: '',
          state: '',
          pinCode: '',
          occupation: '',
          areaId: area.id,
          createdById: created.id,
          userId: created.id,
        },
      });

      return created;
    });

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: 'BORROWER',
    };

    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as any);

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: 'BORROWER' },
    };
  }

  async resetPassword(userId: string, newPassword: string, adminId: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await this.userRepo.updatePassword(userId, hashedPassword);

    await this.auditRepo.create({
      userId: adminId,
      action: 'RESET_PASSWORD',
      entity: 'User',
      entityId: userId,
    });
  }
}
