import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { SettingsService } from '../services/SettingsService';

export class SettingsController {
  private settingsService: SettingsService;

  constructor() {
    this.settingsService = new SettingsService();
  }

  getSettings = async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const settings = await this.settingsService.getAllSettings();
      res.json({ success: true, data: settings });
    } catch (error) {
      next(error);
    }
  };

  getSetting = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const setting = await this.settingsService.getSetting(req.params.key as string);
      res.json({ success: true, data: setting });
    } catch (error) {
      next(error);
    }
  };

  updateSetting = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const setting = await this.settingsService.updateSetting(
        req.params.key as string,
        req.body.value,
        req.user!.userId
      );
      res.json({ success: true, message: 'Setting updated successfully', data: setting });
    } catch (error) {
      next(error);
    }
  };

  resetAllData = async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.settingsService.resetAllData();
      res.json({ success: true, message: result.message });
    } catch (error) {
      next(error);
    }
  };
}
