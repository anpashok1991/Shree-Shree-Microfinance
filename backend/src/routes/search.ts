import { Router } from 'express';
import { SearchController } from '../controllers/SearchController';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new SearchController();

router.use(authenticate);

router.get('/', controller.globalSearch);

export default router;
