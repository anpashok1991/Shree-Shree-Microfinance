import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { LoanService } from '../services/LoanService';

export class LoanController {
  private loanService: LoanService;

  constructor() {
    this.loanService = new LoanService();
  }

  createLoan = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const loan = await this.loanService.createLoan({
        ...req.body,
        createdById: req.user!.userId,
      });
      res.status(201).json({ success: true, message: 'Loan application submitted', data: loan });
    } catch (error) {
      next(error);
    }
  };

  getLoans = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { page, limit, status, customerId, staffId } = req.query;
      let resolvedCustomerId = customerId as string;
      if (customerId === 'me' && req.user?.role === 'BORROWER') {
        const customer = await this.loanService.findCustomerByUserIdOrEmail(req.user.userId, req.user.email || '');
        if (!customer) return res.json({ success: true, data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } });
        resolvedCustomerId = customer.id;
      }
      const result = await this.loanService.getLoans(
        page ? parseInt(page as string) : undefined,
        limit ? parseInt(limit as string) : undefined,
        status as any,
        resolvedCustomerId,
        req.user?.role === 'STAFF' ? req.user.userId : (staffId as string)
      );
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  getLoanById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const loan = await this.loanService.getLoanDetails(req.params.id as string);
      res.json({ success: true, data: loan });
    } catch (error) {
      next(error);
    }
  };

  getPendingApprovals = async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const loans = await this.loanService.getPendingApprovals();
      res.json({ success: true, data: loans });
    } catch (error) {
      next(error);
    }
  };

  approveLoan = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const loan = await this.loanService.approveLoan(req.params.id as string, req.user!.userId);
      res.json({ success: true, message: 'Loan approved successfully', data: loan });
    } catch (error) {
      next(error);
    }
  };

  rejectLoan = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { reason } = req.body;
      const loan = await this.loanService.rejectLoan(req.params.id as string, reason, req.user!.userId);
      res.json({ success: true, message: 'Loan rejected', data: loan });
    } catch (error) {
      next(error);
    }
  };

  returnLoan = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { reason } = req.body;
      const loan = await this.loanService.returnLoan(req.params.id as string, reason, req.user!.userId);
      res.json({ success: true, message: 'Loan returned for correction', data: loan });
    } catch (error) {
      next(error);
    }
  };

  forecloseLoan = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.loanService.forecloseLoan(req.params.id as string, req.user!.userId);
      res.json({ success: true, message: 'Loan foreclosed successfully', data: result });
    } catch (error) {
      next(error);
    }
  };

  renewLoan = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const loan = await this.loanService.renewLoan(req.params.id as string, req.user!.userId);
      res.status(201).json({ success: true, message: 'Loan renewed successfully', data: loan });
    } catch (error) {
      next(error);
    }
  };

  borrowerApply = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const loan = await this.loanService.borrowerApply(req.user!.userId, req.body);
      res.status(201).json({ success: true, message: 'Loan application submitted', data: loan });
    } catch (error) { next(error); }
  };

  calculateLoan = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { amount } = req.query;
      const calculation = await this.loanService.calculateLoanAmount(
        amount ? parseFloat(amount as string) : 0
      );
      res.json({ success: true, data: calculation });
    } catch (error) {
      next(error);
    }
  };

  updateLoan = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const loan = await this.loanService.updateLoan(req.params.id as string, req.body, req.user!.userId);
      res.json({ success: true, message: 'Loan updated', data: loan });
    } catch (error) {
      next(error);
    }
  };

  generateNoc = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const noc = await this.loanService.generateNoc(req.params.id as string);
      res.json({ success: true, data: noc });
    } catch (error) {
      next(error);
    }
  };
}
