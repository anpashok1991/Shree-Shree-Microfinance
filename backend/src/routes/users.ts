import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createUserSchema, updateUserSchema } from '../validators';

const router = Router();
const controller = new UserController();

router.use(authenticate);

router.get('/', authorize('SUPER_ADMIN', 'ADMIN'), controller.getUsers);
router.get('/staff', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), controller.getStaffList);
router.get('/:id', authorize('SUPER_ADMIN', 'ADMIN'), controller.getUserById);
router.post('/', authorize('SUPER_ADMIN', 'ADMIN'), validate(createUserSchema), controller.createUser);
router.put('/:id', authorize('SUPER_ADMIN', 'ADMIN'), validate(updateUserSchema), controller.updateUser);
router.delete('/:id', authorize('SUPER_ADMIN'), controller.deleteUser);
router.put('/:id/status', authorize('SUPER_ADMIN'), controller.toggleStatus);
router.put('/:id/lock', authorize('SUPER_ADMIN'), controller.lockUser);
router.put('/:id/unlock', authorize('SUPER_ADMIN'), controller.unlockUser);
router.put('/:id/reset-password', authorize('SUPER_ADMIN', 'ADMIN'), controller.resetPassword);

export default router;
