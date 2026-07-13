"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SettingsController_1 = require("../controllers/SettingsController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const controller = new SettingsController_1.SettingsController();
router.use(auth_1.authenticate);
router.get('/', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'VIEWER'), controller.getSettings);
router.get('/:key', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'VIEWER'), controller.getSetting);
router.put('/:key', (0, auth_1.authorize)('SUPER_ADMIN'), controller.updateSetting);
router.post('/reset-all-data', (0, auth_1.authorize)('SUPER_ADMIN'), controller.resetAllData);
exports.default = router;
//# sourceMappingURL=settings.js.map