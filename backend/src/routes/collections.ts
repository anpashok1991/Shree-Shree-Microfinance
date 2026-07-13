import { Router } from 'express';
import { CollectionController } from '../controllers/CollectionController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createCollectionSchema } from '../validators';

const router = Router();
const controller = new CollectionController();

router.use(authenticate);

router.get('/', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'), controller.getCollections);
router.get('/today/stats', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'), controller.getTodayStats);
router.post('/', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'), validate(createCollectionSchema), controller.recordCollection);

export default router;
