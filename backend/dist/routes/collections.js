"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CollectionController_1 = require("../controllers/CollectionController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const validators_1 = require("../validators");
const router = (0, express_1.Router)();
const controller = new CollectionController_1.CollectionController();
router.use(auth_1.authenticate);
router.get('/', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'), controller.getCollections);
router.get('/today/stats', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'), controller.getTodayStats);
router.post('/', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'), (0, validate_1.validate)(validators_1.createCollectionSchema), controller.recordCollection);
router.delete('/:id', (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN'), controller.voidCollection);
exports.default = router;
//# sourceMappingURL=collections.js.map