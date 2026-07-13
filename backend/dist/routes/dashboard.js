"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DashboardController_1 = require("../controllers/DashboardController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const controller = new DashboardController_1.DashboardController();
router.use(auth_1.authenticate);
router.get('/stats', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'VIEWER'), controller.getStats);
router.get('/monthly-chart', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'VIEWER'), controller.getMonthlyChart);
router.get('/area-wise', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'VIEWER'), controller.getAreaWiseCollection);
router.get('/staff-performance', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'VIEWER'), controller.getStaffPerformance);
exports.default = router;
//# sourceMappingURL=dashboard.js.map