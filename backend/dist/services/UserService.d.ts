export declare class UserService {
    private userRepo;
    private auditRepo;
    constructor();
    createUser(data: {
        email: string;
        password: string;
        name: string;
        phone: string;
        role: string;
        areaIds?: string[];
        createdById: string;
    }): Promise<{
        name: string;
        id: string;
        email: string;
        phone: string;
        role: string;
        status: string;
        isLocked: boolean;
        loginAttempts: number;
        lastLogin: Date | null;
        createdById: string | null;
        isDeleted: boolean;
        deletedAt: Date | null;
        deletedById: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUser(id: string, data: Partial<{
        name: string;
        phone: string;
        role: string;
        areaIds: string[];
    }>, updatedById: string): Promise<{
        name: string;
        id: string;
        email: string;
        phone: string;
        role: string;
        status: string;
        isLocked: boolean;
        loginAttempts: number;
        lastLogin: Date | null;
        createdById: string | null;
        isDeleted: boolean;
        deletedAt: Date | null;
        deletedById: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteUser(id: string, deletedById: string): Promise<void>;
    toggleUserStatus(id: string, status: 'ACTIVE' | 'INACTIVE', updatedById: string): Promise<void>;
    lockUser(id: string, lockedById: string): Promise<void>;
    unlockUser(id: string, unlockedById: string): Promise<void>;
    getUsers(page?: number, limit?: number): Promise<{
        data: {
            name: string;
            id: string;
            email: string;
            phone: string;
            role: string;
            status: string;
            isLocked: boolean;
            loginAttempts: number;
            lastLogin: Date | null;
            createdById: string | null;
            isDeleted: boolean;
            deletedAt: Date | null;
            deletedById: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getUserById(id: string): Promise<{
        name: string;
        id: string;
        email: string;
        phone: string;
        role: string;
        status: string;
        isLocked: boolean;
        loginAttempts: number;
        lastLogin: Date | null;
        createdById: string | null;
        isDeleted: boolean;
        deletedAt: Date | null;
        deletedById: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getStaffList(): Promise<{
        name: string;
        id: string;
        email: string;
        phone: string;
        role: string;
        status: string;
        isLocked: boolean;
        loginAttempts: number;
        lastLogin: Date | null;
        createdById: string | null;
        isDeleted: boolean;
        deletedAt: Date | null;
        deletedById: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
//# sourceMappingURL=UserService.d.ts.map