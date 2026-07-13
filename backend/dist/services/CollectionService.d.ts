export declare class CollectionService {
    private collectionRepo;
    private loanRepo;
    private customerRepo;
    private receiptRepo;
    private auditRepo;
    constructor();
    recordCollection(data: {
        loanId: string;
        customerId: string;
        amount: number;
        collectedById: string;
        remarks?: string;
        collectionDate?: string;
    }): Promise<{
        id: string;
        status: string;
        isDeleted: boolean;
        deletedAt: Date | null;
        deletedById: string | null;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        amount: number;
        collectedById: string;
        loanId: string;
        remarks: string | null;
        collectionNo: string;
        collectionDate: Date;
    } | null>;
    getCollections(page?: number, limit?: number, loanId?: string, staffId?: string, startDate?: Date, endDate?: Date): Promise<{
        data: {
            id: string;
            status: string;
            isDeleted: boolean;
            deletedAt: Date | null;
            deletedById: string | null;
            createdAt: Date;
            updatedAt: Date;
            customerId: string;
            amount: number;
            collectedById: string;
            loanId: string;
            remarks: string | null;
            collectionNo: string;
            collectionDate: Date;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    voidCollection(collectionId: string, voidedById: string): Promise<void>;
    getTodayStats(): Promise<{
        todayCollection: number;
        monthlyCollection: number;
    }>;
    getStaffCollectionReport(staffId: string, startDate: Date, endDate: Date): Promise<{
        id: string;
        status: string;
        isDeleted: boolean;
        deletedAt: Date | null;
        deletedById: string | null;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        amount: number;
        collectedById: string;
        loanId: string;
        remarks: string | null;
        collectionNo: string;
        collectionDate: Date;
    }[]>;
    getAreaCollectionReport(areaId: string, startDate: Date, endDate: Date): Promise<{
        id: string;
        status: string;
        isDeleted: boolean;
        deletedAt: Date | null;
        deletedById: string | null;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        amount: number;
        collectedById: string;
        loanId: string;
        remarks: string | null;
        collectionNo: string;
        collectionDate: Date;
    }[]>;
}
//# sourceMappingURL=CollectionService.d.ts.map