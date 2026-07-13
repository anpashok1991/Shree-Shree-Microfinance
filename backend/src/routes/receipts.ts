import { Router } from 'express';
import { ReceiptController } from '../controllers/ReceiptController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const controller = new ReceiptController();

router.use(authenticate);

router.get('/collection/:collectionId', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'), controller.getByCollection);
router.get('/loan/:loanId', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'), controller.getByLoan);

export default router;
