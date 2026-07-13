"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AreaRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class AreaRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super('area');
    }
    async findByName(name) {
        return this.findFirst({ name, isDeleted: false });
    }
    async findByCode(code) {
        return this.findFirst({ code, isDeleted: false });
    }
    async findAllWithStats() {
        return this.delegate.findMany({
            where: { isDeleted: false },
            include: {
                _count: { select: { customers: true, users: true } },
            },
        });
    }
}
exports.AreaRepository = AreaRepository;
//# sourceMappingURL=AreaRepository.js.map