"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class SettingsRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super('systemSetting');
    }
    async getByKey(key) {
        return this.delegate.findUnique({ where: { key } });
    }
    async getValue(key, defaultValue = '') {
        const setting = await this.getByKey(key);
        return setting?.value || defaultValue;
    }
    async getNumberValue(key, defaultValue = 0) {
        const value = await this.getValue(key, defaultValue.toString());
        return parseFloat(value) || defaultValue;
    }
    async upsertSetting(key, value, updatedById) {
        return this.delegate.upsert({
            where: { key },
            update: { value, updatedById },
            create: { key, value, updatedById },
        });
    }
    async upsertValue(key, value) {
        return this.upsertSetting(key, value);
    }
    async getAllSettings() {
        const settings = await this.findAll();
        const result = {};
        for (const setting of settings) {
            result[setting.key] = setting.value;
        }
        return result;
    }
}
exports.SettingsRepository = SettingsRepository;
//# sourceMappingURL=SettingsRepository.js.map