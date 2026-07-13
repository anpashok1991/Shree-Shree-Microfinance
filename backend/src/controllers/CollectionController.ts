import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { CollectionService } from '../services/CollectionService';

export class CollectionController {
  private collectionService: CollectionService;

  constructor() {
    this.collectionService = new CollectionService();
  }

  recordCollection = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const collection = await this.collectionService.recordCollection({
        ...req.body,
        collectedById: req.user!.userId,
      });
      res.status(201).json({
        success: true,
        message: 'Collection recorded successfully',
        data: collection,
      });
    } catch (error) {
      next(error);
    }
  };

  getCollections = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { page, limit, loanId, staffId, startDate, endDate } = req.query;
      const result = await this.collectionService.getCollections(
        page ? parseInt(page as string) : undefined,
        limit ? parseInt(limit as string) : undefined,
        loanId as string,
        req.user?.role === 'STAFF' ? req.user.userId : (staffId as string),
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  getTodayStats = async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const stats = await this.collectionService.getTodayStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  };
}
