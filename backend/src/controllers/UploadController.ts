import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { SettingsRepository } from '../repositories/SettingsRepository';
import { CustomerRepository } from '../repositories/CustomerRepository';
import fs from 'fs';

export class UploadController {
  private settingsRepo = new SettingsRepository();
  private customerRepo = new CustomerRepository();

  uploadLogo = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
      const fileBuffer = fs.readFileSync(req.file.path);
      const base64 = fileBuffer.toString('base64');
      const dataUrl = `data:${req.file.mimetype};base64,${base64}`;
      await this.settingsRepo.upsertValue('company_logo', dataUrl);
      fs.unlinkSync(req.file.path);
      res.json({ success: true, message: 'Logo uploaded', data: { url: dataUrl } });
    } catch (error) {
      next(error);
    }
  };

  uploadCustomerDocs = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const customerId = req.params.customerId as string;
      const customer = await this.customerRepo.findById(customerId);
      if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });

      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const updateData: any = {};

      if (files?.aadhaar?.[0]) updateData.aadhaarCopy = `/uploads/documents/${files.aadhaar[0].filename}`;
      if (files?.pan?.[0]) updateData.panCopy = `/uploads/documents/${files.pan[0].filename}`;
      if (files?.photo?.[0]) updateData.photoUpload = `/uploads/photos/${files.photo[0].filename}`;

      await this.customerRepo.update(customerId as string, updateData);
      const updated = await this.customerRepo.findById(customerId as string);

      res.json({ success: true, message: 'Documents uploaded', data: updated });
    } catch (error) {
      next(error);
    }
  };
}
