import { Router } from 'express';
import { UploadController } from '../controllers/UploadController';
import { authenticate, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();
const controller = new UploadController();

router.post('/logo', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), upload.single('logo'), controller.uploadLogo);
router.post('/customer-docs/:customerId', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'BORROWER'), upload.fields([
  { name: 'aadhaar', maxCount: 1 },
  { name: 'pan', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
]), controller.uploadCustomerDocs);

export default router;
