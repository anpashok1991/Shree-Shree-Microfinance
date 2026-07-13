import { Router } from 'express';
import { ExpenseController } from '../controllers/ExpenseController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const controller = new ExpenseController();

router.use(authenticate);

router.get('/', authorize('SUPER_ADMIN', 'ADMIN', 'VIEWER'), controller.getExpenses);
router.post('/', authorize('SUPER_ADMIN', 'ADMIN'), controller.createExpense);
router.delete('/:id', authorize('SUPER_ADMIN'), controller.deleteExpense);

export default router;
