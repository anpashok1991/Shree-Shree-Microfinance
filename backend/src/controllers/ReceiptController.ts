import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { ReceiptRepository } from '../repositories/ReceiptRepository';

export class ReceiptController {
  private receiptRepo = new ReceiptRepository();

  getByCollection = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const receipt = await this.receiptRepo.findFirst({ collectionId: req.params.collectionId as string });
      if (!receipt) return res.status(404).json({ success: false, message: 'Receipt not found' });
      res.json({ success: true, data: receipt });
    } catch (error) { next(error); }
  };

  getByLoan = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const receipts = await this.receiptRepo.findByLoan(req.params.loanId as string);
      res.json({ success: true, data: receipts });
    } catch (error) { next(error); }
  };
}
