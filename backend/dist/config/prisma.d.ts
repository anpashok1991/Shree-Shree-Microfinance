import { PrismaClient } from '@prisma/client';
export declare const prisma: PrismaClient<{
    log: ({
        level: "warn";
        emit: "event";
    } | {
        level: "error";
        emit: "event";
    })[];
}, "error" | "warn", import("@prisma/client/runtime/library").DefaultArgs>;
export declare function connectDatabase(): Promise<void>;
export declare function disconnectDatabase(): Promise<void>;
//# sourceMappingURL=prisma.d.ts.map