import { BaseRepository } from './BaseRepository';
import { SystemSetting } from '@prisma/client';
export declare class SettingsRepository extends BaseRepository<SystemSetting> {
    constructor();
    getByKey(key: string): Promise<SystemSetting | null>;
    getValue(key: string, defaultValue?: string): Promise<string>;
    getNumberValue(key: string, defaultValue?: number): Promise<number>;
    upsertSetting(key: string, value: string, updatedById?: string): Promise<SystemSetting>;
    upsertValue(key: string, value: string): Promise<SystemSetting>;
    getAllSettings(): Promise<Record<string, string>>;
}
//# sourceMappingURL=SettingsRepository.d.ts.map