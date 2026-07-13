import { Router } from 'express';
import { ReportController } from '../controllers/ReportController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const controller = new ReportController();

router.use(authenticate);

router.get('/daily-collection', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'VIEWER'), controller.getDailyCollection);
router.get('/monthly-collection', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'VIEWER'), controller.getMonthlyCollection);
router.get('/customer-ledger/:customerId', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'VIEWER'), controller.getCustomerLedger);
router.get('/loan-ledger/:loanId', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'VIEWER'), controller.getLoanLedger);
router.get('/outstanding', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'VIEWER'), controller.getOutstandingReport);
router.get('/defaulters', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'VIEWER'), controller.getDefaulterReport);
router.get('/renewals', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'VIEWER'), controller.getRenewalReport);
router.get('/profit', authorize('SUPER_ADMIN', 'ADMIN', 'VIEWER'), controller.getProfitReport);
router.get('/expenses', authorize('SUPER_ADMIN', 'ADMIN', 'VIEWER'), controller.getExpenseReport);

export default router;
