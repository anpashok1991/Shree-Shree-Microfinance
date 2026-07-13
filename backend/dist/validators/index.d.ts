import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const changePasswordSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currentPassword: string;
    newPassword: string;
}, {
    currentPassword: string;
    newPassword: string;
}>;
export declare const createUserSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
    phone: z.ZodString;
    role: z.ZodEnum<["SUPER_ADMIN", "ADMIN", "MANAGER", "STAFF", "VIEWER"]>;
    areaIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: "STAFF" | "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "VIEWER";
    areaIds?: string[] | undefined;
}, {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: "STAFF" | "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "VIEWER";
    areaIds?: string[] | undefined;
}>;
export declare const updateUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<["SUPER_ADMIN", "ADMIN", "MANAGER", "STAFF", "VIEWER"]>>;
    areaIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    phone?: string | undefined;
    role?: "STAFF" | "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "VIEWER" | undefined;
    areaIds?: string[] | undefined;
}, {
    name?: string | undefined;
    phone?: string | undefined;
    role?: "STAFF" | "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "VIEWER" | undefined;
    areaIds?: string[] | undefined;
}>;
export declare const createAreaSchema: z.ZodObject<{
    name: z.ZodString;
    code: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    code: string;
}, {
    name: string;
    code: string;
}>;
export declare const createCustomerSchema: z.ZodObject<{
    name: z.ZodString;
    fatherName: z.ZodString;
    mobile: z.ZodString;
    alternateMobile: z.ZodOptional<z.ZodString>;
    aadhaarNumber: z.ZodString;
    panNumber: z.ZodOptional<z.ZodString>;
    address: z.ZodString;
    village: z.ZodString;
    district: z.ZodString;
    state: z.ZodString;
    pinCode: z.ZodString;
    occupation: z.ZodString;
    monthlyIncome: z.ZodOptional<z.ZodNumber>;
    guarantorName: z.ZodOptional<z.ZodString>;
    guarantorMobile: z.ZodOptional<z.ZodString>;
    guarantorAadhaar: z.ZodOptional<z.ZodString>;
    areaId: z.ZodString;
    assignedStaffId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    fatherName: string;
    mobile: string;
    aadhaarNumber: string;
    address: string;
    village: string;
    district: string;
    state: string;
    pinCode: string;
    occupation: string;
    areaId: string;
    alternateMobile?: string | undefined;
    panNumber?: string | undefined;
    monthlyIncome?: number | undefined;
    guarantorName?: string | undefined;
    guarantorMobile?: string | undefined;
    guarantorAadhaar?: string | undefined;
    assignedStaffId?: string | undefined;
}, {
    name: string;
    fatherName: string;
    mobile: string;
    aadhaarNumber: string;
    address: string;
    village: string;
    district: string;
    state: string;
    pinCode: string;
    occupation: string;
    areaId: string;
    alternateMobile?: string | undefined;
    panNumber?: string | undefined;
    monthlyIncome?: number | undefined;
    guarantorName?: string | undefined;
    guarantorMobile?: string | undefined;
    guarantorAadhaar?: string | undefined;
    assignedStaffId?: string | undefined;
}>;
export declare const updateCustomerSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    fatherName: z.ZodOptional<z.ZodString>;
    mobile: z.ZodOptional<z.ZodString>;
    alternateMobile: z.ZodOptional<z.ZodString>;
    aadhaarNumber: z.ZodOptional<z.ZodString>;
    panNumber: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    village: z.ZodOptional<z.ZodString>;
    district: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodString>;
    pinCode: z.ZodOptional<z.ZodString>;
    occupation: z.ZodOptional<z.ZodString>;
    monthlyIncome: z.ZodOptional<z.ZodNumber>;
    guarantorName: z.ZodOptional<z.ZodString>;
    guarantorMobile: z.ZodOptional<z.ZodString>;
    guarantorAadhaar: z.ZodOptional<z.ZodString>;
    areaId: z.ZodOptional<z.ZodString>;
    assignedStaffId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["PENDING", "ACTIVE", "CLOSED", "BLACKLISTED"]>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    status?: "ACTIVE" | "PENDING" | "CLOSED" | "BLACKLISTED" | undefined;
    fatherName?: string | undefined;
    mobile?: string | undefined;
    alternateMobile?: string | undefined;
    aadhaarNumber?: string | undefined;
    panNumber?: string | undefined;
    address?: string | undefined;
    village?: string | undefined;
    district?: string | undefined;
    state?: string | undefined;
    pinCode?: string | undefined;
    occupation?: string | undefined;
    monthlyIncome?: number | undefined;
    guarantorName?: string | undefined;
    guarantorMobile?: string | undefined;
    guarantorAadhaar?: string | undefined;
    areaId?: string | undefined;
    assignedStaffId?: string | undefined;
}, {
    name?: string | undefined;
    status?: "ACTIVE" | "PENDING" | "CLOSED" | "BLACKLISTED" | undefined;
    fatherName?: string | undefined;
    mobile?: string | undefined;
    alternateMobile?: string | undefined;
    aadhaarNumber?: string | undefined;
    panNumber?: string | undefined;
    address?: string | undefined;
    village?: string | undefined;
    district?: string | undefined;
    state?: string | undefined;
    pinCode?: string | undefined;
    occupation?: string | undefined;
    monthlyIncome?: number | undefined;
    guarantorName?: string | undefined;
    guarantorMobile?: string | undefined;
    guarantorAadhaar?: string | undefined;
    areaId?: string | undefined;
    assignedStaffId?: string | undefined;
}>;
export declare const createLoanSchema: z.ZodObject<{
    customerId: z.ZodString;
    amount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    customerId: string;
    amount: number;
}, {
    customerId: string;
    amount: number;
}>;
export declare const approveLoanSchema: z.ZodObject<{
    loanId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    loanId: string;
}, {
    loanId: string;
}>;
export declare const rejectLoanSchema: z.ZodObject<{
    loanId: z.ZodString;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    loanId: string;
    reason: string;
}, {
    loanId: string;
    reason: string;
}>;
export declare const returnLoanSchema: z.ZodObject<{
    loanId: z.ZodString;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    loanId: string;
    reason: string;
}, {
    loanId: string;
    reason: string;
}>;
export declare const updateLoanSchema: z.ZodObject<{
    amount: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    amount?: number | undefined;
}, {
    amount?: number | undefined;
}>;
export declare const createCollectionSchema: z.ZodObject<{
    loanId: z.ZodString;
    customerId: z.ZodString;
    amount: z.ZodNumber;
    remarks: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    customerId: string;
    amount: number;
    loanId: string;
    remarks?: string | undefined;
}, {
    customerId: string;
    amount: number;
    loanId: string;
    remarks?: string | undefined;
}>;
export declare const createSettingSchema: z.ZodObject<{
    key: z.ZodString;
    value: z.ZodString;
}, "strip", z.ZodTypeAny, {
    value: string;
    key: string;
}, {
    value: string;
    key: string;
}>;
export declare const updateSettingSchema: z.ZodObject<{
    value: z.ZodString;
}, "strip", z.ZodTypeAny, {
    value: string;
}, {
    value: string;
}>;
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined>;
    limit: z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
}, {
    limit?: string | undefined;
    page?: string | undefined;
}>;
export declare const globalSearchSchema: z.ZodObject<{
    q: z.ZodString;
}, "strip", z.ZodTypeAny, {
    q: string;
}, {
    q: string;
}>;
//# sourceMappingURL=index.d.ts.map