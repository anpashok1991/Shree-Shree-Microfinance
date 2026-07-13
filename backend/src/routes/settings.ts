import { Router } from 'express';
import { SettingsController } from '../controllers/SettingsController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const controller = new SettingsController();

router.use(authenticate);

router.get('/', authorize('SUPER_ADMIN', 'ADMIN', 'VIEWER'), controller.getSettings);
router.get('/:key', authorize('SUPER_ADMIN', 'ADMIN', 'VIEWER'), controller.getSetting);
router.put('/:key', authorize('SUPER_ADMIN'), controller.updateSetting);

export default router;
