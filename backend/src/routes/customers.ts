import { Router } from 'express';
import { CustomerController } from '../controllers/CustomerController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createCustomerSchema, updateCustomerSchema } from '../validators';

const router = Router();
const controller = new CustomerController();

router.use(authenticate);

router.get('/', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'), controller.getCustomers);
router.get('/search', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'), controller.searchCustomers);
router.get('/:id', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'), controller.getCustomerById);
router.post('/', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'), validate(createCustomerSchema), controller.createCustomer);
router.put('/:id', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), validate(updateCustomerSchema), controller.updateCustomer);
router.delete('/:id', authorize('SUPER_ADMIN'), controller.deleteCustomer);

export default router;
