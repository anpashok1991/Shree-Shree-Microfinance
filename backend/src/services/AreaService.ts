import { AreaRepository } from '../repositories/AreaRepository';
import { NotFoundError, ConflictError } from '../utils/errors';

export class AreaService {
  private areaRepo: AreaRepository;

  constructor() {
    this.areaRepo = new AreaRepository();
  }

  async createArea(name: string, code: string) {
    const existing = await this.areaRepo.findByName(name);
    if (existing) throw new ConflictError('Area name already exists');

    const existingCode = await this.areaRepo.findByCode(code);
    if (existingCode) throw new ConflictError('Area code already exists');

    return this.areaRepo.create({ name, code });
  }

  async getAreas() {
    return this.areaRepo.findAllWithStats();
  }

  async getAreaById(id: string) {
    const area = await this.areaRepo.findById(id, {
      _count: { select: { customers: true, users: true } },
    });
    if (!area) throw new NotFoundError('Area not found');
    return area;
  }

  async updateArea(id: string, name?: string, code?: string) {
    const area = await this.areaRepo.findById(id);
    if (!area) throw new NotFoundError('Area not found');

    if (name && name !== area.name) {
      const existing = await this.areaRepo.findByName(name);
      if (existing) throw new ConflictError('Area name already exists');
    }

    return this.areaRepo.update(id, { name: name || area.name, code: code || area.code });
  }

  async deleteArea(id: string, deletedById: string) {
    const area = await this.areaRepo.findById(id);
    if (!area) throw new NotFoundError('Area not found');
    await this.areaRepo.softDelete(id, deletedById);
  }
}
