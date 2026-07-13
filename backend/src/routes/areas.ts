import { Router } from 'express';
import { AreaController } from '../controllers/AreaController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createAreaSchema } from '../validators';

const router = Router();
const controller = new AreaController();

router.use(authenticate);

router.get('/', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'), controller.getAreas);
router.get('/:id', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), controller.getAreaById);
router.post('/', authorize('SUPER_ADMIN', 'ADMIN'), validate(createAreaSchema), controller.createArea);
router.put('/:id', authorize('SUPER_ADMIN', 'ADMIN'), controller.updateArea);
router.delete('/:id', authorize('SUPER_ADMIN'), controller.deleteArea);

export default router;
