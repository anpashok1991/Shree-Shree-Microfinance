import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { SearchService } from '../services/SearchService';

export class SearchController {
  private searchService: SearchService;

  constructor() {
    this.searchService = new SearchService();
  }

  globalSearch = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { q } = req.query;
      const results = await this.searchService.search(q as string, req.user!);
      res.json({ success: true, data: results });
    } catch (error) {
      next(error);
    }
  };
}
