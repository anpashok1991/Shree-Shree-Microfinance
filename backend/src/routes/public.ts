import { Router } from 'express';
import { PublicController } from '../controllers/PublicController';

const router = Router();
const controller = new PublicController();

router.get('/company-info', controller.getCompanyInfo);
router.get('/logo', controller.getLogo);

export default router;
