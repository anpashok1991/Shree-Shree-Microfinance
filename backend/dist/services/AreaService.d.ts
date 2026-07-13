export declare class AreaService {
    private areaRepo;
    constructor();
    createArea(name: string, code: string): Promise<{
        name: string;
        id: string;
        isDeleted: boolean;
        deletedAt: Date | null;
        deletedById: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        isActive: boolean;
    }>;
    getAreas(): Promise<{
        name: string;
        id: string;
        isDeleted: boolean;
        deletedAt: Date | null;
        deletedById: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        isActive: boolean;
    }[]>;
    getAreaById(id: string): Promise<{
        name: string;
        id: string;
        isDeleted: boolean;
        deletedAt: Date | null;
        deletedById: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        isActive: boolean;
    }>;
    updateArea(id: string, name?: string, code?: string): Promise<{
        name: string;
        id: string;
        isDeleted: boolean;
        deletedAt: Date | null;
        deletedById: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        isActive: boolean;
    }>;
    deleteArea(id: string, deletedById: string): Promise<void>;
}
//# sourceMappingURL=AreaService.d.ts.map