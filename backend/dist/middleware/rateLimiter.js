"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLimiter = exports.apiLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const isDev = process.env.NODE_ENV !== 'production';
exports.apiLimiter = isDev
    ? (req, _res, next) => next()
    : (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 500,
        message: { success: false, message: 'Too many requests, please try again later.' },
        standardHeaders: true,
        legacyHeaders: false,
    });
exports.authLimiter = isDev
    ? (req, _res, next) => next()
    : (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: { success: false, message: 'Too many login attempts, please try again later.' },
        standardHeaders: true,
        legacyHeaders: false,
    });
//# sourceMappingURL=rateLimiter.js.map