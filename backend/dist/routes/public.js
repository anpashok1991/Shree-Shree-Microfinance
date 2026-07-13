"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PublicController_1 = require("../controllers/PublicController");
const router = (0, express_1.Router)();
const controller = new PublicController_1.PublicController();
router.get('/company-info', controller.getCompanyInfo);
exports.default = router;
//# sourceMappingURL=public.js.map