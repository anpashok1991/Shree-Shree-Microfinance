import bcrypt from 'bcryptjs';
import { SettingsRepository } from '../repositories/SettingsRepository';
import { NotFoundError } from '../utils/errors';
import { prisma } from '../config/prisma';
import { config } from '../config';

export class SettingsService {
  private settingsRepo: SettingsRepository;

  constructor() {
    this.settingsRepo = new SettingsRepository();
  }

  async getAllSettings() {
    return this.settingsRepo.getAllSettings();
  }

  async getSetting(key: string) {
    const setting = await this.settingsRepo.getByKey(key);
    if (!setting) throw new NotFoundError('Setting not found');
    return setting;
  }

  async updateSetting(key: string, value: string, updatedById?: string) {
    return this.settingsRepo.upsertSetting(key, value, updatedById);
  }

  async getDefaultSettings(): Promise<Record<string, string>> {
    return {
      company_name: 'Shree Shree Group',
      company_logo: '',
      company_address: '',
      company_gst: '',
      company_phone: '',
      company_email: '',
      file_charge_percent: '3',
      renewal_charge_percent: '20',
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
    await prisma.$transaction([
      prisma.receipt.deleteMany(),
      prisma.collection.deleteMany(),
      prisma.notification.deleteMany(),
      prisma.auditLog.deleteMany(),
      prisma.expense.deleteMany(),
      prisma.loan.deleteMany(),
      prisma.customer.deleteMany(),
      prisma.enquiry.deleteMany(),
      prisma.userArea.deleteMany(),
      prisma.systemSetting.deleteMany(),
      prisma.area.deleteMany(),
      prisma.user.deleteMany(),
    ]);

    // Re-create SUPER_ADMIN
    const hashedPassword = await bcrypt.hash(config.admin.password, 12);
    await prisma.user.create({
      data: {
        email: config.admin.email,
        password: hashedPassword,
        name: 'Super Admin',
        phone: config.admin.phone,
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
      },
    });

    // Re-create default settings
    const defaults = await this.getDefaultSettings();
    for (const [key, value] of Object.entries(defaults)) {
      await prisma.systemSetting.create({ data: { key, value } });
    }

    return { message: 'All data has been erased and system reset to factory defaults' };
  }
}
