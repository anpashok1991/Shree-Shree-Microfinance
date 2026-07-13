"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = seedAdmin;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../config/prisma");
const logger_1 = require("../config/logger");
const config_1 = require("../config");
async function seedAdmin() {
    try {
        const existingAdmin = await prisma_1.prisma.user.findUnique({
            where: { email: config_1.config.admin.email },
        });
        if (!existingAdmin) {
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
            logger_1.logger.info('Super Admin created successfully');
            console.log('  ✓ Super Admin created');
        }
        const defaultSettings = [
            { key: 'company_name', value: 'Shree Shree Group' },
            { key: 'company_address', value: '' },
            { key: 'company_phone', value: config_1.config.admin.phone },
            { key: 'company_email', value: config_1.config.admin.email },
            { key: 'file_charge_percent', value: '3' },
            { key: 'renewal_charge_percent', value: '20' },
            { key: 'foreclosure_charge_percent', value: '0' },
            { key: 'max_loan', value: '50000' },
            { key: 'min_loan', value: '5000' },
            { key: 'loan_tenure_days', value: '100' },
            { key: 'interest_rate', value: '20' },
            { key: 'currency', value: 'INR' },
            { key: 'language', value: 'en' },
        ];
        for (const setting of defaultSettings) {
            const existing = await prisma_1.prisma.systemSetting.findUnique({
                where: { key: setting.key },
            });
            if (!existing) {
                await prisma_1.prisma.systemSetting.create({ data: setting });
            }
        }
        logger_1.logger.info('Default settings initialized');
    }
    catch (error) {
        logger_1.logger.error('Seed error:', error);
    }
}
if (require.main === module) {
    seedAdmin()
        .then(() => {
        console.log('Seeding completed');
        process.exit(0);
    })
        .catch((error) => {
        console.error('Seeding failed:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=seed.js.map