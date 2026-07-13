import { BaseRepository } from './BaseRepository';
import { User } from '@prisma/client';
export declare class UserRepository extends BaseRepository<User> {
    constructor();
    findByEmail(email: string): Promise<User | null>;
    findByPhone(phone: string): Promise<User | null>;
    updateLoginAttempts(id: string, attempts: number): Promise<User>;
    lockUser(id: string): Promise<User>;
    unlockUser(id: string): Promise<User>;
    updatePassword(id: string, hashedPassword: string): Promise<User>;
    updateStatus(id: string, status: 'ACTIVE' | 'INACTIVE'): Promise<User>;
    findWithAreas(id: string): Promise<User | null>;
    assignAreas(userId: string, areaIds: string[]): Promise<void>;
}
//# sourceMappingURL=UserRepository.d.ts.map