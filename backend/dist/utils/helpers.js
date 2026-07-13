"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCustomerId = generateCustomerId;
exports.generateLoanNumber = generateLoanNumber;
exports.generateCollectionNo = generateCollectionNo;
exports.generateReceiptNo = generateReceiptNo;
exports.generateRenewalNumber = generateRenewalNumber;
exports.calculateLoanDetails = calculateLoanDetails;
exports.calculateRenewal = calculateRenewal;
exports.sanitizeString = sanitizeString;
exports.formatCurrency = formatCurrency;
exports.getPaginationParams = getPaginationParams;
const uuid_1 = require("uuid");
function generateCustomerId() {
    const year = new Date().getFullYear();
    const unique = (0, uuid_1.v4)().slice(0, 8).toUpperCase();
    return `SSG-${year}-${unique}`;
}
function generateLoanNumber() {
    const year = new Date().getFullYear();
    const unique = (0, uuid_1.v4)().slice(0, 6).toUpperCase();
    return `LN-${year}-${unique}`;
}
function generateCollectionNo() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `COL-${timestamp}-${random}`;
}
function generateReceiptNo() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `RCP-${timestamp}-${random}`;
}
function generateRenewalNumber(loanNumber) {
    const parts = loanNumber.split('-');
    const count = parseInt(parts[parts.length - 1] || '0', 36) + 1;
    return `${loanNumber}-RN-${count.toString(36).toUpperCase()}`;
}
function calculateLoanDetails(amount, fileChargePercent = 3, tenure = 100) {
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
function calculateRenewal(remainingBalance, renewalChargePercent = 20) {
    const renewalCharge = (remainingBalance * renewalChargePercent) / 100;
    const newLoanAmount = remainingBalance + renewalCharge;
    return { renewalCharge, newLoanAmount };
}
function sanitizeString(input) {
    return input.replace(/<[^>]*>/g, '').trim();
}
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
    }).format(amount);
}
function getPaginationParams(page, limit) {
    const p = page || 1;
    const l = Math.min(limit || 10, 100);
    return { page: p, limit: l, skip: (p - 1) * l };
}
//# sourceMappingURL=helpers.js.map