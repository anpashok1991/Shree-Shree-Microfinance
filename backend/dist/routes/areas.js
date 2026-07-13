"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AreaController_1 = require("../controllers/AreaController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const validators_1 = require("../validators");
const router = (0, express_1.Router)();
const controller = new AreaController_1.AreaController();
router.use(auth_1.authenticate);
router.get('/', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'), controller.getAreas);
router.get('/:id', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MANAGER'), controller.getAreaById);
router.post('/', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN'), (0, validate_1.validate)(validators_1.createAreaSchema), controller.createArea);
router.put('/:id', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN'), controller.updateArea);
router.delete('/:id', (0, auth_1.authorize)('SUPER_ADMIN'), controller.deleteArea);
exports.default = router;
//# sourceMappingURL=areas.js.map