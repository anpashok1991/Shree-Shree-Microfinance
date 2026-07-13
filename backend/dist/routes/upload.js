"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UploadController_1 = require("../controllers/UploadController");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
const controller = new UploadController_1.UploadController();
router.post('/logo', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN'), upload_1.upload.single('logo'), controller.uploadLogo);
router.post('/customer-docs/:customerId', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'BORROWER'), upload_1.upload.fields([
    { name: 'aadhaar', maxCount: 1 },
    { name: 'pan', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
]), controller.uploadCustomerDocs);
exports.default = router;
//# sourceMappingURL=upload.js.map