import { BaseRepository } from './BaseRepository';
import { SystemSetting } from '@prisma/client';

export class SettingsRepository extends BaseRepository<SystemSetting> {
  constructor() {
    super('systemSetting');
  }

  async getByKey(key: string): Promise<SystemSetting | null> {
    return this.delegate.findUnique({ where: { key } });
  }

  async getValue(key: string, defaultValue: string = ''): Promise<string> {
    const setting = await this.getByKey(key);
    return setting?.value || defaultValue;
  }

  async getNumberValue(key: string, defaultValue: number = 0): Promise<number> {
    const value = await this.getValue(key, defaultValue.toString());
    return parseFloat(value) || defaultValue;
  }

  async upsertSetting(key: string, value: string, updatedById?: string): Promise<SystemSetting> {
    return this.delegate.upsert({
      where: { key },
      update: { value, updatedById },
      create: { key, value, updatedById },
    });
  }

  async upsertValue(key: string, value: string): Promise<SystemSetting> {
    return this.upsertSetting(key, value);
  }

  async getAllSettings(): Promise<Record<string, string>> {
    const settings = await this.findAll();
    const result: Record<string, string> = {};
    for (const setting of settings) {
      result[setting.key] = setting.value;
    }
    return result;
  }
}
