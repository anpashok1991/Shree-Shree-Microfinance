import { BaseRepository } from './BaseRepository';
import { Collection } from '@prisma/client';
export declare class CollectionRepository extends BaseRepository<Collection> {
    constructor();
    findByLoan(loanId: string): Promise<Collection[]>;
    findByStaff(staffId: string, date?: Date): Promise<Collection[]>;
    getTodayCollection(): Promise<number>;
    getMonthlyCollection(): Promise<number>;
    getStaffPerformance(staffId: string): Promise<{
        totalCollected: number;
        collectionCount: number;
    }>;
}
//# sourceMappingURL=CollectionRepository.d.ts.map