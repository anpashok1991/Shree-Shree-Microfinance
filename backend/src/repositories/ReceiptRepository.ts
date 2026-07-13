import { BaseRepository } from './BaseRepository';
import { Receipt } from '@prisma/client';

export class ReceiptRepository extends BaseRepository<Receipt> {
  constructor() {
    super('receipt');
  }

  async findByLoan(loanId: string): Promise<Receipt[]> {
    return this.findAll({
      where: { loanId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByCustomer(customerId: string): Promise<Receipt[]> {
    return this.findAll({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByReceiptNo(receiptNo: string): Promise<Receipt | null> {
    return this.delegate.findUnique({ where: { receiptNo } });
  }
}
