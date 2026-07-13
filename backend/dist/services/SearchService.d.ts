import { JwtPayload } from '../types';
export declare class SearchService {
    search(query: string, user: JwtPayload): Promise<{
        customers: {
            name: string;
            id: string;
            status: string;
            customerId: string;
            mobile: string;
        }[];
        loans: {
            customer: {
                name: string;
            };
            id: string;
            status: string;
            amount: number;
            loanNumber: string;
        }[];
        collections: {
            customer: {
                name: string;
            };
            id: string;
            amount: number;
            collectionNo: string;
        }[];
        areas: {
            name: string;
            id: string;
            isDeleted: boolean;
            deletedAt: Date | null;
            deletedById: string | null;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            isActive: boolean;
        }[];
        users: {
            name: string;
            id: string;
            email: string;
            role: string;
        }[];
    }>;
}
//# sourceMappingURL=SearchService.d.ts.map