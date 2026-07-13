export declare class AuthService {
    private userRepo;
    private auditRepo;
    private customerRepo;
    private areaRepo;
    constructor();
    login(email: string, password: string, ipAddress?: string, userAgent?: string): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
            role: string;
        };
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    register(data: {
        name: string;
        email: string;
        phone: string;
        password: string;
        address?: string;
        aadhaarNumber?: string;
    }): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
            role: string;
        };
    }>;
    resetPassword(userId: string, newPassword: string, adminId: string): Promise<void>;
}
//# sourceMappingURL=AuthService.d.ts.map