"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ExpenseController_1 = require("../controllers/ExpenseController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const controller = new ExpenseController_1.ExpenseController();
router.use(auth_1.authenticate);
router.get('/', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'VIEWER'), controller.getExpenses);
router.post('/', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN'), controller.createExpense);
router.delete('/:id', (0, auth_1.authorize)('SUPER_ADMIN'), controller.deleteExpense);
exports.default = router;
//# sourceMappingURL=expenses.js.map