export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'STAFF' | 'VIEWER' | 'BORROWER';
  status: 'ACTIVE' | 'INACTIVE';
  isLocked: boolean;
  areas?: UserArea[];
}

export interface UserArea {
  userId: string;
  areaId: string;
  area: Area;
}

export interface Area {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  _count?: { customers: number; users: number };
}

export interface Customer {
  id: string;
  customerId: string;
  name: string;
  fatherName: string;
  mobile: string;
  alternateMobile?: string;
  aadhaarNumber: string;
  panNumber?: string;
  address: string;
  village: string;
  district: string;
  state: string;
  pinCode: string;
  occupation: string;
  monthlyIncome?: number;
  status: string;
  area: Area;
  assignedStaff?: { id: string; name: string };
  loans?: Loan[];
}

export interface Loan {
  id: string;
  loanNumber: string;
  renewalNumber?: string;
  customer: Customer;
  amount: number;
  fileCharge: number;
  disbursedAmount: number;
  dailyCollection: number;
  totalRecovery: number;
  tenure: number;
  status: string;
  totalPaid: number;
  outstanding: number;
  startDate?: string;
  endDate?: string;
  approvedBy?: { id: string; name: string };
  createdBy?: { id: string; name: string };
  collections?: Collection[];
  renewedLoans?: Loan[];
  parentLoan?: Loan;
}

export interface Collection {
  id: string;
  collectionNo: string;
  loan: Loan;
  customer: Customer;
  amount: number;
  status: string;
  collectedBy: { id: string; name: string };
  collectionDate: string;
  receipt?: Receipt;
}

export interface Receipt {
  id: string;
  receiptNo: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
}

export interface DashboardStats {
  todayCollection: number;
  monthlyCollection: number;
  activeLoans: number;
  pendingApprovals: number;
  overdueLoans: number;
  totalCustomers: number;
  totalProfit: number;
  totalOutstanding: number;
}

export interface LoanCalculation {
  amount: number;
  fileChargePercent: number;
  fileCharge: number;
  disbursedAmount: number;
  dailyCollection: number;
  totalRecovery: number;
  tenure: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
