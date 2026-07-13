"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CustomerController_1 = require("../controllers/CustomerController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const validators_1 = require("../validators");
const router = (0, express_1.Router)();
const controller = new CustomerController_1.CustomerController();
router.use(auth_1.authenticate);
router.get('/', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'), controller.getCustomers);
router.get('/search', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'), controller.searchCustomers);
router.get('/:id', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'), controller.getCustomerById);
router.post('/', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'), (0, validate_1.validate)(validators_1.createCustomerSchema), controller.createCustomer);
router.put('/:id', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MANAGER'), (0, validate_1.validate)(validators_1.updateCustomerSchema), controller.updateCustomer);
router.delete('/:id', (0, auth_1.authorize)('SUPER_ADMIN'), controller.deleteCustomer);
exports.default = router;
//# sourceMappingURL=customers.js.map