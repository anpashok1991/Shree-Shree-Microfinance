import { DashboardStats } from '../types';
export declare class DashboardService {
    private collectionRepo;
    private loanRepo;
    private customerRepo;
    constructor();
    getDashboardStats(): Promise<DashboardStats>;
    getMonthlyChartData(year?: number): Promise<{
        month: number;
        total: number;
    }[]>;
    getAreaWiseCollection(): Promise<({
        customers: ({
            loans: {
                totalPaid: number;
                outstanding: number;
            }[];
        } & {
            name: string;
            id: string;
            status: string;
            createdById: string;
            isDeleted: boolean;
            deletedAt: Date | null;
            deletedById: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            customerId: string;
            photo: string | null;
            fatherName: string;
            mobile: string;
            alternateMobile: string | null;
            aadhaarNumber: string;
            panNumber: string | null;
            address: string;
            village: string;
            district: string;
            state: string;
            pinCode: string;
            occupation: string;
            monthlyIncome: number | null;
            guarantorName: string | null;
            guarantorMobile: string | null;
            guarantorAadhaar: string | null;
            aadhaarCopy: string | null;
            panCopy: string | null;
            photoUpload: string | null;
            documents: string | null;
            areaId: string;
            assignedStaffId: string | null;
        })[];
        _count: {
            customers: number;
        };
    } & {
        name: string;
        id: string;
        isDeleted: boolean;
        deletedAt: Date | null;
        deletedById: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        isActive: boolean;
    })[]>;
    getStaffPerformance(): Promise<{
        name: string;
        id: string;
        email: string;
        collections: {
            amount: number;
        }[];
        _count: {
            assignedCustomers: number;
            collections: number;
        };
    }[]>;
}
//# sourceMappingURL=DashboardService.d.ts.map