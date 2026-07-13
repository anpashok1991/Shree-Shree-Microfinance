"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const SettingsRepository_1 = require("../repositories/SettingsRepository");
const errors_1 = require("../utils/errors");
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
exports.SettingsService = SettingsService;
//# sourceMappingURL=SettingsService.js.map