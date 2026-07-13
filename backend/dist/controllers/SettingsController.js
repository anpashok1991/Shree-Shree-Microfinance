"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const SettingsService_1 = require("../services/SettingsService");
class SettingsController {
    constructor() {
        this.getSettings = async (_req, res, next) => {
            try {
                const settings = await this.settingsService.getAllSettings();
                res.json({ success: true, data: settings });
            }
            catch (error) {
                next(error);
            }
        };
        this.getSetting = async (req, res, next) => {
            try {
                const setting = await this.settingsService.getSetting(req.params.key);
                res.json({ success: true, data: setting });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateSetting = async (req, res, next) => {
            try {
                const setting = await this.settingsService.updateSetting(req.params.key, req.body.value, req.user.userId);
                res.json({ success: true, message: 'Setting updated successfully', data: setting });
            }
            catch (error) {
                next(error);
            }
        };
        this.settingsService = new SettingsService_1.SettingsService();
    }
}
exports.SettingsController = SettingsController;
//# sourceMappingURL=SettingsController.js.map