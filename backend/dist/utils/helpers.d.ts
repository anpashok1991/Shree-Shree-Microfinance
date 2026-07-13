import { LoanCalculation } from '../types';
export declare function generateCustomerId(): string;
export declare function generateLoanNumber(): string;
export declare function generateCollectionNo(): string;
export declare function generateReceiptNo(): string;
export declare function generateRenewalNumber(loanNumber: string): string;
export declare function calculateLoanDetails(amount: number, fileChargePercent?: number, tenure?: number): LoanCalculation;
export declare function calculateRenewal(remainingBalance: number, renewalChargePercent?: number): {
    renewalCharge: number;
    newLoanAmount: number;
};
export declare function sanitizeString(input: string): string;
export declare function formatCurrency(amount: number): string;
export declare function getPaginationParams(page?: number, limit?: number): {
    page: number;
    limit: number;
    skip: number;
};
//# sourceMappingURL=helpers.d.ts.map