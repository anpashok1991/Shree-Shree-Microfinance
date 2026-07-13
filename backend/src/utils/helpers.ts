import { v4 as uuidv4 } from 'uuid';
import { LoanCalculation } from '../types';

export function generateCustomerId(): string {
  const year = new Date().getFullYear();
  const unique = uuidv4().slice(0, 8).toUpperCase();
  return `SSG-${year}-${unique}`;
}

export function generateLoanNumber(): string {
  const year = new Date().getFullYear();
  const unique = uuidv4().slice(0, 6).toUpperCase();
  return `LN-${year}-${unique}`;
}

export function generateCollectionNo(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `COL-${timestamp}-${random}`;
}

export function generateReceiptNo(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RCP-${timestamp}-${random}`;
}

export function generateRenewalNumber(loanNumber: string): string {
  const parts = loanNumber.split('-');
  const count = parseInt(parts[parts.length - 1] || '0', 36) + 1;
  return `${loanNumber}-RN-${count.toString(36).toUpperCase()}`;
}

export function calculateLoanDetails(
  amount: number,
  fileChargePercent: number = 3,
  tenure: number = 100
): LoanCalculation {
  const fileCharge = (amount * fileChargePercent) / 100;
  const disbursedAmount = amount - fileCharge;
  const dailyCollection = (amount * 1.2) / 100;
  const totalRecovery = amount * 1.2;

  return {
    amount,
    fileChargePercent,
    fileCharge,
    disbursedAmount,
    dailyCollection,
    totalRecovery,
    tenure,
  };
}

export function calculateRenewal(
  remainingBalance: number,
  renewalChargePercent: number = 20
): { renewalCharge: number; newLoanAmount: number } {
  const renewalCharge = (remainingBalance * renewalChargePercent) / 100;
  const newLoanAmount = remainingBalance + renewalCharge;
  return { renewalCharge, newLoanAmount };
}

export function sanitizeString(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getPaginationParams(
  page?: number,
  limit?: number
): { page: number; limit: number; skip: number } {
  const p = page || 1;
  const l = Math.min(limit || 10, 100);
  return { page: p, limit: l, skip: (p - 1) * l };
}
