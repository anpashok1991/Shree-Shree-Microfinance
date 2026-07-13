"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const SettingsRepository_1 = require("../repositories/SettingsRepository");
const errors_1 = require("../utils/errors");
const prisma_1 = require("../config/prisma");
const config_1 = require("../config");
class SettingsService {
    constructor() {
        this.settingsRepo = new SettingsRepository_1.SettingsRepository();
    }
    async getAllSettings() {
        return this.settingsRepo.getAllSettings();
    }
    async getSetting(key) {
        const setting = await this.settingsRepo.getByKey(key);
        if (!setting)
            throw new errors_1.NotFoundError('Setting not found');
        return setting;
    }
    async updateSetting(key, value, updatedById) {
        return this.settingsRepo.upsertSetting(key, value, updatedById);
    }
    async getDefaultSettings() {
        return {
            company_name: 'Shree Shree Group',
            company_logo: '',
            company_address: '',
            company_gst: '',
            company_phone: '',
            company_email: '',
            file_charge_percent: '3',
            renewal_charge_percent: '20',
            foreclosure_charge_percent: '0',
            max_loan: '50000',
            min_loan: '5000',
            loan_tenure_days: '100',
            currency: 'INR',
            language: 'en',
            interest_rate: '20',
        };
    }
    async initializeDefaults() {
        const defaults = await this.getDefaultSettings();
        for (const [key, value] of Object.entries(defaults)) {
            const existing = await this.settingsRepo.getByKey(key);
            if (!existing) {
                await this.settingsRepo.create({ key, value });
            }
        }
    }
    async resetAllData() {
        // Wipe ALL data in FK-safe order
        await prisma_1.prisma.$transaction([
            prisma_1.prisma.receipt.deleteMany(),
            prisma_1.prisma.collection.deleteMany(),
            prisma_1.prisma.notification.deleteMany(),
            prisma_1.prisma.auditLog.deleteMany(),
            prisma_1.prisma.expense.deleteMany(),
            prisma_1.prisma.loan.deleteMany(),
            prisma_1.prisma.customer.deleteMany(),
            prisma_1.prisma.enquiry.deleteMany(),
            prisma_1.prisma.userArea.deleteMany(),
            prisma_1.prisma.systemSetting.deleteMany(),
            prisma_1.prisma.area.deleteMany(),
            prisma_1.prisma.user.deleteMany(),
        ]);
        // Re-create SUPER_ADMIN
        const hashedPassword = await bcryptjs_1.default.hash(config_1.config.admin.password, 12);
        await prisma_1.prisma.user.create({
            data: {
                email: config_1.config.admin.email,
                password: hashedPassword,
                name: 'Super Admin',
                phone: config_1.config.admin.phone,
                role: 'SUPER_ADMIN',
                status: 'ACTIVE',
            },
        });
        // Re-create default settings
        const defaults = await this.getDefaultSettings();
        for (const [key, value] of Object.entries(defaults)) {
            await prisma_1.prisma.systemSetting.create({ data: { key, value } });
        }
        return { message: 'All data has been erased and system reset to factory defaults' };
    }
}
exports.SettingsService = SettingsService;
//# sourceMappingURL=SettingsService.js.map