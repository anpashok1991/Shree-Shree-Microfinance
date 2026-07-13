"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalSearchSchema = exports.paginationSchema = exports.updateSettingSchema = exports.createSettingSchema = exports.createCollectionSchema = exports.updateLoanSchema = exports.returnLoanSchema = exports.rejectLoanSchema = exports.approveLoanSchema = exports.createLoanSchema = exports.updateCustomerSchema = exports.createCustomerSchema = exports.createAreaSchema = exports.updateUserSchema = exports.createUserSchema = exports.changePasswordSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string(),
    newPassword: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
exports.createUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    phone: zod_1.z.string().min(10, 'Invalid phone number'),
    role: zod_1.z.enum(['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER']),
    areaIds: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    phone: zod_1.z.string().min(10).optional(),
    role: zod_1.z.enum(['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER']).optional(),
    areaIds: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.createAreaSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Area name must be at least 2 characters'),
    code: zod_1.z.string().min(1, 'Code is required'),
});
exports.createCustomerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    fatherName: zod_1.z.string().min(2),
    mobile: zod_1.z.string().min(10),
    alternateMobile: zod_1.z.string().optional(),
    aadhaarNumber: zod_1.z.string().min(12).max(14),
    panNumber: zod_1.z.string().optional(),
    address: zod_1.z.string().min(5),
    village: zod_1.z.string().min(2),
    district: zod_1.z.string().min(2),
    state: zod_1.z.string().min(2),
    pinCode: zod_1.z.string().min(6),
    occupation: zod_1.z.string().min(2),
    monthlyIncome: zod_1.z.number().positive().optional(),
    guarantorName: zod_1.z.string().optional(),
    guarantorMobile: zod_1.z.string().optional(),
    guarantorAadhaar: zod_1.z.string().optional(),
    areaId: zod_1.z.string(),
    assignedStaffId: zod_1.z.string().optional(),
});
exports.updateCustomerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    fatherName: zod_1.z.string().min(2).optional(),
    mobile: zod_1.z.string().min(10).optional(),
    alternateMobile: zod_1.z.string().optional(),
    aadhaarNumber: zod_1.z.string().min(12).max(14).optional(),
    panNumber: zod_1.z.string().optional(),
    address: zod_1.z.string().min(5).optional(),
    village: zod_1.z.string().optional(),
    district: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    pinCode: zod_1.z.string().optional(),
    occupation: zod_1.z.string().optional(),
    monthlyIncome: zod_1.z.number().positive().optional(),
    guarantorName: zod_1.z.string().optional(),
    guarantorMobile: zod_1.z.string().optional(),
    guarantorAadhaar: zod_1.z.string().optional(),
    areaId: zod_1.z.string().optional(),
    assignedStaffId: zod_1.z.string().optional(),
    status: zod_1.z.enum(['PENDING', 'ACTIVE', 'CLOSED', 'BLACKLISTED']).optional(),
});
exports.createLoanSchema = zod_1.z.object({
    customerId: zod_1.z.string(),
    amount: zod_1.z.number().positive(),
});
exports.approveLoanSchema = zod_1.z.object({
    loanId: zod_1.z.string(),
});
exports.rejectLoanSchema = zod_1.z.object({
    loanId: zod_1.z.string(),
    reason: zod_1.z.string().min(5),
});
exports.returnLoanSchema = zod_1.z.object({
    loanId: zod_1.z.string(),
    reason: zod_1.z.string().min(5),
});
exports.updateLoanSchema = zod_1.z.object({
    amount: zod_1.z.number().positive().optional(),
});
exports.createCollectionSchema = zod_1.z.object({
    loanId: zod_1.z.string(),
    customerId: zod_1.z.string(),
    amount: zod_1.z.number().positive(),
    remarks: zod_1.z.string().optional(),
});
exports.createSettingSchema = zod_1.z.object({
    key: zod_1.z.string().min(1),
    value: zod_1.z.string().min(1),
});
exports.updateSettingSchema = zod_1.z.object({
    value: zod_1.z.string().min(1),
});
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.string().optional().transform((v) => (v ? parseInt(v) : 1)),
    limit: zod_1.z.string().optional().transform((v) => (v ? parseInt(v) : 10)),
});
exports.globalSearchSchema = zod_1.z.object({
    q: zod_1.z.string().min(1, 'Search query is required'),
});
//# sourceMappingURL=index.js.map