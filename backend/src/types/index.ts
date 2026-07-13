import { Request } from 'express';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: PaginatedResponse<T>['pagination'];
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
