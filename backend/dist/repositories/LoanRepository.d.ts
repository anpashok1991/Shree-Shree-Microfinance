import { BaseRepository } from './BaseRepository';
import { Loan } from '@prisma/client';
export declare class LoanRepository extends BaseRepository<Loan> {
    constructor();
    findByLoanNumber(loanNumber: string): Promise<Loan | null>;
    findPendingApprovals(): Promise<Loan[]>;
    findActiveLoans(): Promise<Loan[]>;
    findOverdueLoans(): Promise<Loan[]>;
    findByCustomer(customerId: string): Promise<Loan[]>;
    findByStaff(staffId: string): Promise<Loan[]>;
    getLoanHistory(loanId: string): Promise<Loan | null>;
    getStats(): Promise<{
        activeLoans: number;
        totalDisbursed: number;
        totalOutstanding: number;
        totalRecovered: number;
    }>;
}
//# sourceMappingURL=LoanRepository.d.ts.map