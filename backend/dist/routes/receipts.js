"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ReceiptController_1 = require("../controllers/ReceiptController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const controller = new ReceiptController_1.ReceiptController();
router.use(auth_1.authenticate);
router.get('/collection/:collectionId', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'), controller.getByCollection);
router.get('/loan/:loanId', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'), controller.getByLoan);
exports.default = router;
//# sourceMappingURL=receipts.js.map