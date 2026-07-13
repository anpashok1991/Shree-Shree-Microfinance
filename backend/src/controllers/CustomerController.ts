import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { CustomerService } from '../services/CustomerService';

export class CustomerController {
  private customerService: CustomerService;

  constructor() {
    this.customerService = new CustomerService();
  }

  createCustomer = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const customer = await this.customerService.createCustomer({
        ...req.body,
        createdById: req.user!.userId,
      });
      res.status(201).json({ success: true, message: 'Customer created successfully', data: customer });
    } catch (error) {
      next(error);
    }
  };

  getCustomers = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { page, limit, areaId, staffId } = req.query;
      const result = await this.customerService.getCustomers(
        page ? parseInt(page as string) : undefined,
        limit ? parseInt(limit as string) : undefined,
        areaId as string | undefined,
        (req.user?.role === 'STAFF' ? req.user.userId : staffId) as string | undefined
      );
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  getCustomerById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const customer = await this.customerService.getCustomerById(req.params.id as string);
      res.json({ success: true, data: customer });
    } catch (error) {
      next(error);
    }
  };

  updateCustomer = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const customer = await this.customerService.updateCustomer(
        req.params.id as string,
        req.body,
        req.user!.userId
      );
      res.json({ success: true, message: 'Customer updated successfully', data: customer });
    } catch (error) {
      next(error);
    }
  };

  deleteCustomer = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.customerService.deleteCustomer(req.params.id as string, req.user!.userId);
      res.json({ success: true, message: 'Customer deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  searchCustomers = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { q } = req.query;
      const customers = await this.customerService.searchCustomers(q as string);
      res.json({ success: true, data: customers });
    } catch (error) {
      next(error);
    }
  };
}
