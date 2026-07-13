export declare class ExpenseService {
    private expenseRepo;
    constructor();
    createExpense(data: {
        description: string;
        amount: number;
        category: string;
        recordedById: string;
        remarks?: string;
        date?: Date;
    }): Promise<{
        id: string;
        isDeleted: boolean;
        deletedAt: Date | null;
        deletedById: string | null;
        createdAt: Date;
        updatedAt: Date;
        amount: number;
        date: Date;
        remarks: string | null;
        description: string;
        category: string;
        recordedById: string;
    }>;
    getExpenses(page?: number, limit?: number): Promise<{
        data: {
            id: string;
            isDeleted: boolean;
            deletedAt: Date | null;
            deletedById: string | null;
            createdAt: Date;
            updatedAt: Date;
            amount: number;
            date: Date;
            remarks: string | null;
            description: string;
            category: string;
            recordedById: string;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    deleteExpense(id: string, deletedById: string): Promise<void>;
}
//# sourceMappingURL=ExpenseService.d.ts.map