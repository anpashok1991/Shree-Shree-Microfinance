"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class UserRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super('user');
    }
    async findByEmail(email) {
        return this.delegate.findUnique({ where: { email } });
    }
    async findByPhone(phone) {
        return this.findFirst({ phone, isDeleted: false });
    }
    async updateLoginAttempts(id, attempts) {
        return this.update(id, { loginAttempts: attempts });
    }
    async lockUser(id) {
        return this.update(id, { isLocked: true });
    }
    async unlockUser(id) {
        return this.update(id, { isLocked: false, loginAttempts: 0 });
    }
    async updatePassword(id, hashedPassword) {
        return this.update(id, { password: hashedPassword });
    }
    async updateStatus(id, status) {
        return this.update(id, { status });
    }
    async findWithAreas(id) {
        return this.delegate.findUnique({
            where: { id },
            include: { areas: { include: { area: true } } },
        });
    }
    async assignAreas(userId, areaIds) {
        await this.prisma.userArea.deleteMany({ where: { userId } });
        await this.prisma.userArea.createMany({
            data: areaIds.map((areaId) => ({ userId, areaId })),
        });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map