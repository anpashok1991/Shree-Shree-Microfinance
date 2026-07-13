import { SettingsRepository } from '../repositories/SettingsRepository';
import { NotFoundError } from '../utils/errors';

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
}
