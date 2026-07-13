"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const EnquiryController_1 = require("../controllers/EnquiryController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const controller = new EnquiryController_1.EnquiryController();
router.post('/', controller.create);
router.get('/', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN'), controller.getAll);
router.put('/:id/read', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN'), controller.markRead);
router.put('/:id/respond', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN'), controller.respond);
exports.default = router;
//# sourceMappingURL=enquiries.js.map