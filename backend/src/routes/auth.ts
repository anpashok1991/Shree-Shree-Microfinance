import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { loginSchema, changePasswordSchema } from '../validators';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();
const controller = new AuthController();

router.post('/login', authLimiter, validate(loginSchema), controller.login);
router.post('/register', authLimiter, controller.register);
router.get('/profile', authenticate, controller.getProfile);
router.put('/change-password', authenticate, validate(changePasswordSchema), controller.changePassword);

export default router;
