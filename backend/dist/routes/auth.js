"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const validators_1 = require("../validators");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.Router)();
const controller = new AuthController_1.AuthController();
router.post('/login', rateLimiter_1.authLimiter, (0, validate_1.validate)(validators_1.loginSchema), controller.login);
router.post('/register', rateLimiter_1.authLimiter, controller.register);
router.get('/profile', auth_1.authenticate, controller.getProfile);
router.put('/change-password', auth_1.authenticate, (0, validate_1.validate)(validators_1.changePasswordSchema), controller.changePassword);
exports.default = router;
//# sourceMappingURL=auth.js.map