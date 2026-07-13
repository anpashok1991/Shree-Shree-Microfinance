export declare class SettingsService {
    private settingsRepo;
    constructor();
    getAllSettings(): Promise<Record<string, string>>;
    getSetting(key: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        value: string;
        key: string;
        updatedById: string | null;
    }>;
    updateSetting(key: string, value: string, updatedById?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        value: string;
        key: string;
        updatedById: string | null;
    }>;
    getDefaultSettings(): Promise<Record<string, string>>;
    initializeDefaults(): Promise<void>;
    resetAllData(): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=SettingsService.d.ts.map