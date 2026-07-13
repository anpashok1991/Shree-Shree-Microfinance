import { BaseRepository } from './BaseRepository';
import { Receipt } from '@prisma/client';
export declare class ReceiptRepository extends BaseRepository<Receipt> {
    constructor();
    findByLoan(loanId: string): Promise<Receipt[]>;
    findByCustomer(customerId: string): Promise<Receipt[]>;
    findByReceiptNo(receiptNo: string): Promise<Receipt | null>;
}
//# sourceMappingURL=ReceiptRepository.d.ts.map