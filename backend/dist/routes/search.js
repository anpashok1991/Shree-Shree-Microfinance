"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SearchController_1 = require("../controllers/SearchController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const controller = new SearchController_1.SearchController();
router.use(auth_1.authenticate);
router.get('/', controller.globalSearch);
exports.default = router;
//# sourceMappingURL=search.js.map