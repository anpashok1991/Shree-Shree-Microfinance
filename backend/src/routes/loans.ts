import { Router } from 'express';
import { LoanController } from '../controllers/LoanController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createLoanSchema, rejectLoanSchema, returnLoanSchema, updateLoanSchema } from '../validators';

const router = Router();
const controller = new LoanController();

router.use(authenticate);

router.get('/', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF', 'BORROWER'), controller.getLoans);
router.get('/pending', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), controller.getPendingApprovals);
router.get('/calculate', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF', 'BORROWER'), controller.calculateLoan);
router.get('/:id', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF', 'BORROWER'), controller.getLoanById);
router.post('/', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'), validate(createLoanSchema), controller.createLoan);
router.post('/borrower-apply', authorize('BORROWER'), controller.borrowerApply);
router.put('/:id/approve', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), controller.approveLoan);
router.put('/:id/reject', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), validate(rejectLoanSchema), controller.rejectLoan);
router.put('/:id/return', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), validate(returnLoanSchema), controller.returnLoan);
router.put('/:id', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), validate(updateLoanSchema), controller.updateLoan);
router.post('/:id/renew', authorize('SUPER_ADMIN', 'ADMIN'), controller.renewLoan);

export default router;
