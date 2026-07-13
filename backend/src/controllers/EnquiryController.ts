import { Request, Response, NextFunction } from 'express';
import { EnquiryService } from '../services/EnquiryService';

export class EnquiryController {
  private service = new EnquiryService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const enquiry = await this.service.create(req.body);
      res.status(201).json({ success: true, message: 'Enquiry submitted', data: enquiry });
    } catch (error) { next(error); }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await this.service.getAll(page, limit);
      res.json({ success: true, ...result });
    } catch (error) { next(error); }
  };

  markRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.markRead(req.params.id as string);
      res.json({ success: true, message: 'Marked as read' });
    } catch (error) { next(error); }
  };

  respond = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.respond(req.params.id as string, req.body.response);
      res.json({ success: true, message: 'Response sent' });
    } catch (error) { next(error); }
  };
}
