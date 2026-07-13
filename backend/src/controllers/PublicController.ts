import { Request, Response, NextFunction } from 'express';
import { SettingsRepository } from '../repositories/SettingsRepository';

export class PublicController {
  private settingsRepo = new SettingsRepository();

  getCompanyInfo = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await this.settingsRepo.getAllSettings();
      const info = {
        companyName: settings.company_name || 'Shree Shree Microfinance',
        tagline: settings.tagline || 'Empowering Communities, Enabling Dreams',
        about: settings.about_text || 'We provide financial services to underserved communities.',
        services: [
          { title: 'Micro Loans', description: 'Small loans for small businesses and individuals' },
          { title: 'Business Loans', description: 'Support for local entrepreneurs' },
          { title: 'Emergency Loans', description: 'Quick financial support in times of need' },
          { title: 'Savings', description: 'Secure savings options' },
        ],
        contactEmail: settings.contact_email || 'info@shreeshree.com',
        contactPhone: settings.contact_phone || '+91-9876543210',
        address: settings.company_address || 'Main Road, Near Market, City',
        logo: settings.company_logo || null,
      };
      res.json({ success: true, data: info });
    } catch (error) { next(error); }
  };

  getLogo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const value = await this.settingsRepo.getValue('company_logo');
      if (!value) return res.status(404).json({ success: false, message: 'No logo' });

      // Data URL — extract mime & base64, serve as image
      if (value.startsWith('data:')) {
        const m = value.match(/^data:(.+?);base64,(.+)$/);
        if (m) {
          const mimeType = m[1];
          const data = Buffer.from(m[2], 'base64');
          res.setHeader('Content-Type', mimeType);
          res.setHeader('Cache-Control', 'public, max-age=86400');
          return res.send(data);
        }
      }

      // HTTP/HTTPS URL — redirect
      if (value.startsWith('http://') || value.startsWith('https://')) {
        return res.redirect(value);
      }

      return res.status(404).json({ success: false, message: 'Invalid logo data' });
    } catch (error) { next(error); }
  };
}
