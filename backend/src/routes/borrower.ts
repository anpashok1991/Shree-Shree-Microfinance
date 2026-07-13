import { Router } from 'express';
import { BorrowerController } from '../controllers/BorrowerController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const controller = new BorrowerController();

router.use(authenticate);
router.use(authorize('BORROWER'));

router.get('/profile', controller.getProfile);
router.put('/profile', controller.saveProfile);
router.get('/loans/:id', controller.getLoanDetail);

export default router;
