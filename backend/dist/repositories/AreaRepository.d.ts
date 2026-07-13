import { BaseRepository } from './BaseRepository';
import { Area } from '@prisma/client';
export declare class AreaRepository extends BaseRepository<Area> {
    constructor();
    findByName(name: string): Promise<Area | null>;
    findByCode(code: string): Promise<Area | null>;
    findAllWithStats(): Promise<Area[]>;
}
//# sourceMappingURL=AreaRepository.d.ts.map