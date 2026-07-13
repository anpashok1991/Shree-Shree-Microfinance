"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BorrowerController_1 = require("../controllers/BorrowerController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const controller = new BorrowerController_1.BorrowerController();
router.use(auth_1.authenticate);
router.use((0, auth_1.authorize)('BORROWER'));
router.get('/profile', controller.getProfile);
router.put('/profile', controller.saveProfile);
router.get('/loans/:id', controller.getLoanDetail);
exports.default = router;
//# sourceMappingURL=borrower.js.map