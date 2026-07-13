import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { AreaService } from '../services/AreaService';

export class AreaController {
  private areaService: AreaService;

  constructor() {
    this.areaService = new AreaService();
  }

  createArea = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const area = await this.areaService.createArea(req.body.name, req.body.code);
      res.status(201).json({ success: true, message: 'Area created successfully', data: area });
    } catch (error) {
      next(error);
    }
  };

  getAreas = async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const areas = await this.areaService.getAreas();
      res.json({ success: true, data: areas });
    } catch (error) {
      next(error);
    }
  };

  getAreaById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const area = await this.areaService.getAreaById(req.params.id as string);
      res.json({ success: true, data: area });
    } catch (error) {
      next(error);
    }
  };

  updateArea = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const area = await this.areaService.updateArea(req.params.id as string, req.body.name, req.body.code);
      res.json({ success: true, message: 'Area updated successfully', data: area });
    } catch (error) {
      next(error);
    }
  };

  deleteArea = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.areaService.deleteArea(req.params.id as string, req.user!.userId);
      res.json({ success: true, message: 'Area deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
