"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../config/prisma");
const config_1 = require("../config");
const UserRepository_1 = require("../repositories/UserRepository");
const AuditRepository_1 = require("../repositories/AuditRepository");
const CustomerRepository_1 = require("../repositories/CustomerRepository");
const AreaRepository_1 = require("../repositories/AreaRepository");
const errors_1 = require("../utils/errors");
const helpers_1 = require("../utils/helpers");
class AuthService {
    constructor() {
        this.userRepo = new UserRepository_1.UserRepository();
        this.auditRepo = new AuditRepository_1.AuditRepository();
        this.customerRepo = new CustomerRepository_1.CustomerRepository();
        this.areaRepo = new AreaRepository_1.AreaRepository();
    }
    async login(email, password, ipAddress, userAgent) {
        const user = await this.userRepo.findByEmail(email);
        if (!user) {
            throw new errors_1.UnauthorizedError('Invalid credentials');
        }
        if (user.status === 'INACTIVE') {
            throw new errors_1.UnauthorizedError('Account is inactive. Contact admin.');
        }
        if (user.isLocked) {
            throw new errors_1.UnauthorizedError('Account is locked. Contact admin.');
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            const attempts = user.loginAttempts + 1;
            if (attempts >= 5) {
                await this.userRepo.lockUser(user.id);
                throw new errors_1.UnauthorizedError('Account locked due to multiple failed attempts');
            }
            await this.userRepo.updateLoginAttempts(user.id, attempts);
            throw new errors_1.UnauthorizedError('Invalid credentials');
        }
        await this.userRepo.update(user.id, {
            loginAttempts: 0,
            lastLogin: new Date(),
        });
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };
        const token = jsonwebtoken_1.default.sign(payload, config_1.config.jwt.secret, {
            expiresIn: config_1.config.jwt.expiresIn,
        });
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
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.userRepo.findById(userId);
        if (!user)
            throw new errors_1.UnauthorizedError('User not found');
        const isValid = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isValid)
            throw new errors_1.UnauthorizedError('Current password is incorrect');
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 12);
        await this.userRepo.updatePassword(userId, hashedPassword);
    }
    async register(data) {
        const existing = await this.userRepo.findByEmail(data.email);
        if (existing)
            throw new errors_1.ConflictError('Email already registered');
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 12);
        const user = await prisma_1.prisma.$transaction(async (tx) => {
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
            const customerId = (0, helpers_1.generateCustomerId)();
            await tx.customer.create({
                data: {
                    customerId,
                    name: data.name,
                    fatherName: data.name,
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
        const payload = {
            userId: user.id,
            email: user.email,
            role: 'BORROWER',
        };
        const token = jsonwebtoken_1.default.sign(payload, config_1.config.jwt.secret, {
            expiresIn: config_1.config.jwt.expiresIn,
        });
        return {
            token,
            user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: 'BORROWER' },
        };
    }
    async resetPassword(userId, newPassword, adminId) {
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 12);
        await this.userRepo.updatePassword(userId, hashedPassword);
        await this.auditRepo.create({
            userId: adminId,
            action: 'RESET_PASSWORD',
            entity: 'User',
            entityId: userId,
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map