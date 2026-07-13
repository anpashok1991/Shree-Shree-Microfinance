import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { BorrowerService } from '../services/BorrowerService';

export class BorrowerController {
  private borrowerService: BorrowerService;

  constructor() {
    this.borrowerService = new BorrowerService();
  }

  getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const profile = await this.borrowerService.getProfile(req.user!.userId);
      res.json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  };

  saveProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const profile = await this.borrowerService.createOrUpdateProfile(req.user!.userId, req.body);
      res.json({ success: true, message: 'Profile saved', data: profile });
    } catch (error) {
      next(error);
    }
  };

  getLoanDetail = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const loan = await this.borrowerService.getLoanDetail(req.user!.userId, req.params.id as string);
      res.json({ success: true, data: loan });
    } catch (error) {
      next(error);
    }
  };
}
