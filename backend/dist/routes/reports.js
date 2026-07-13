"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ReportController_1 = require("../controllers/ReportController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const controller = new ReportController_1.ReportController();
router.use(auth_1.authenticate);
router.get('/daily-collection', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'VIEWER'), controller.getDailyCollection);
router.get('/monthly-collection', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'VIEWER'), controller.getMonthlyCollection);
router.get('/customer-ledger/:customerId', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'VIEWER'), controller.getCustomerLedger);
router.get('/loan-ledger/:loanId', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'VIEWER'), controller.getLoanLedger);
router.get('/outstanding', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'VIEWER'), controller.getOutstandingReport);
router.get('/defaulters', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'VIEWER'), controller.getDefaulterReport);
router.get('/renewals', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'VIEWER'), controller.getRenewalReport);
router.get('/profit', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'VIEWER'), controller.getProfitReport);
router.get('/expenses', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'VIEWER'), controller.getExpenseReport);
exports.default = router;
//# sourceMappingURL=reports.js.map