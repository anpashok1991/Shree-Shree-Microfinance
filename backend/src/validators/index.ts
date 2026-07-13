import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Invalid phone number'),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER']),
  areaIds: z.array(z.string()).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(10).optional(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER']).optional(),
  areaIds: z.array(z.string()).optional(),
});

export const createAreaSchema = z.object({
  name: z.string().min(2, 'Area name must be at least 2 characters'),
  code: z.string().min(1, 'Code is required'),
});

export const createCustomerSchema = z.object({
  name: z.string().min(2),
  fatherName: z.string().min(2),
  mobile: z.string().min(10),
  alternateMobile: z.string().optional(),
  aadhaarNumber: z.string().min(12).max(14),
  panNumber: z.string().optional(),
  address: z.string().min(5),
  village: z.string().min(2),
  district: z.string().min(2),
  state: z.string().min(2),
  pinCode: z.string().min(6),
  occupation: z.string().min(2),
  monthlyIncome: z.number().positive().optional(),
  guarantorName: z.string().optional(),
  guarantorMobile: z.string().optional(),
  guarantorAadhaar: z.string().optional(),
  areaId: z.string(),
  assignedStaffId: z.string().optional(),
});

export const updateCustomerSchema = z.object({
  name: z.string().min(2).optional(),
  fatherName: z.string().min(2).optional(),
  mobile: z.string().min(10).optional(),
  alternateMobile: z.string().optional(),
  aadhaarNumber: z.string().min(12).max(14).optional(),
  panNumber: z.string().optional(),
  address: z.string().min(5).optional(),
  village: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  pinCode: z.string().optional(),
  occupation: z.string().optional(),
  monthlyIncome: z.number().positive().optional(),
  guarantorName: z.string().optional(),
  guarantorMobile: z.string().optional(),
  guarantorAadhaar: z.string().optional(),
  areaId: z.string().optional(),
  assignedStaffId: z.string().optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'CLOSED', 'BLACKLISTED']).optional(),
});

export const createLoanSchema = z.object({
  customerId: z.string(),
  amount: z.number().positive(),
});

export const approveLoanSchema = z.object({
  loanId: z.string(),
});

export const rejectLoanSchema = z.object({
  loanId: z.string(),
  reason: z.string().min(5),
});

export const returnLoanSchema = z.object({
  loanId: z.string(),
  reason: z.string().min(5),
});

export const updateLoanSchema = z.object({
  amount: z.number().positive().optional(),
});

export const createCollectionSchema = z.object({
  loanId: z.string(),
  customerId: z.string(),
  amount: z.number().positive(),
  remarks: z.string().optional(),
});

export const createSettingSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
});

export const updateSettingSchema = z.object({
  value: z.string().min(1),
});

export const paginationSchema = z.object({
  page: z.string().optional().transform((v) => (v ? parseInt(v) : 1)),
  limit: z.string().optional().transform((v) => (v ? parseInt(v) : 10)),
});

export const globalSearchSchema = z.object({
  q: z.string().min(1, 'Search query is required'),
});
