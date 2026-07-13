import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const controller = new DashboardController();

router.use(authenticate);

router.get('/stats', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'VIEWER'), controller.getStats);
router.get('/monthly-chart', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'VIEWER'), controller.getMonthlyChart);
router.get('/area-wise', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'VIEWER'), controller.getAreaWiseCollection);
router.get('/staff-performance', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'VIEWER'), controller.getStaffPerformance);

export default router;
