"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AreaService = void 0;
const AreaRepository_1 = require("../repositories/AreaRepository");
const errors_1 = require("../utils/errors");
class AreaService {
    constructor() {
        this.areaRepo = new AreaRepository_1.AreaRepository();
    }
    async createArea(name, code) {
        const existing = await this.areaRepo.findByName(name);
        if (existing)
            throw new errors_1.ConflictError('Area name already exists');
        const existingCode = await this.areaRepo.findByCode(code);
        if (existingCode)
            throw new errors_1.ConflictError('Area code already exists');
        return this.areaRepo.create({ name, code });
    }
    async getAreas() {
        return this.areaRepo.findAllWithStats();
    }
    async getAreaById(id) {
        const area = await this.areaRepo.findById(id, {
            _count: { select: { customers: true, users: true } },
        });
        if (!area)
            throw new errors_1.NotFoundError('Area not found');
        return area;
    }
    async updateArea(id, name, code) {
        const area = await this.areaRepo.findById(id);
        if (!area)
            throw new errors_1.NotFoundError('Area not found');
        if (name && name !== area.name) {
            const existing = await this.areaRepo.findByName(name);
            if (existing)
                throw new errors_1.ConflictError('Area name already exists');
        }
        return this.areaRepo.update(id, { name: name || area.name, code: code || area.code });
    }
    async deleteArea(id, deletedById) {
        const area = await this.areaRepo.findById(id);
        if (!area)
            throw new errors_1.NotFoundError('Area not found');
        await this.areaRepo.softDelete(id, deletedById);
    }
}
exports.AreaService = AreaService;
//# sourceMappingURL=AreaService.js.map