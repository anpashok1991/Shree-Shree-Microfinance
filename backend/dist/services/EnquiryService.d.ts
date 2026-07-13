export declare class EnquiryService {
    create(data: {
        name: string;
        email: string;
        phone: string;
        message: string;
    }): Promise<{
        message: string;
        name: string;
        id: string;
        email: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        isRead: boolean;
        response: string | null;
    }>;
    getAll(page?: number, limit?: number): Promise<{
        data: {
            message: string;
            name: string;
            id: string;
            email: string;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            isRead: boolean;
            response: string | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    markRead(id: string): Promise<{
        message: string;
        name: string;
        id: string;
        email: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        isRead: boolean;
        response: string | null;
    }>;
    respond(id: string, response: string): Promise<{
        message: string;
        name: string;
        id: string;
        email: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        isRead: boolean;
        response: string | null;
    }>;
}
//# sourceMappingURL=EnquiryService.d.ts.map