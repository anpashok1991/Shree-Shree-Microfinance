import { BaseRepository } from './BaseRepository';
import { Customer } from '@prisma/client';
export declare class CustomerRepository extends BaseRepository<Customer> {
    constructor();
    findByCustomerId(customerId: string): Promise<Customer | null>;
    findByAadhaar(aadhaarNumber: string): Promise<Customer | null>;
    findByMobile(mobile: string): Promise<Customer | null>;
    search(query: string): Promise<Customer[]>;
    findByUserId(userId: string): Promise<Customer | null>;
    findByArea(areaId: string): Promise<Customer[]>;
    findByStaff(staffId: string): Promise<Customer[]>;
}
//# sourceMappingURL=CustomerRepository.d.ts.map