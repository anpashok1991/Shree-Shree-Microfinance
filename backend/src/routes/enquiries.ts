import { Router } from 'express';
import { EnquiryController } from '../controllers/EnquiryController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const controller = new EnquiryController();

router.post('/', controller.create);
router.get('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), controller.getAll);
router.put('/:id/read', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), controller.markRead);
router.put('/:id/respond', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), controller.respond);

export default router;
