"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserService_1 = require("../services/UserService");
class UserController {
    constructor() {
        this.createUser = async (req, res, next) => {
            try {
                const user = await this.userService.createUser({
                    ...req.body,
                    createdById: req.user.userId,
                });
                res.status(201).json({ success: true, message: 'User created successfully', data: user });
            }
            catch (error) {
                next(error);
            }
        };
        this.getUsers = async (req, res, next) => {
            try {
                const { page, limit } = req.query;
                const result = await this.userService.getUsers(page ? parseInt(page) : undefined, limit ? parseInt(limit) : undefined);
                res.json({ success: true, ...result });
            }
            catch (error) {
                next(error);
            }
        };
        this.getUserById = async (req, res, next) => {
            try {
                const user = await this.userService.getUserById(req.params.id);
                res.json({ success: true, data: user });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateUser = async (req, res, next) => {
            try {
                const user = await this.userService.updateUser(req.params.id, req.body, req.user.userId);
                res.json({ success: true, message: 'User updated successfully', data: user });
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteUser = async (req, res, next) => {
            try {
                await this.userService.deleteUser(req.params.id, req.user.userId);
                res.json({ success: true, message: 'User deleted successfully' });
            }
            catch (error) {
                next(error);
            }
        };
        this.toggleStatus = async (req, res, next) => {
            try {
                const { status } = req.body;
                await this.userService.toggleUserStatus(req.params.id, status, req.user.userId);
                res.json({ success: true, message: `User ${status === 'ACTIVE' ? 'activated' : 'deactivated'} successfully` });
            }
            catch (error) {
                next(error);
            }
        };
        this.lockUser = async (req, res, next) => {
            try {
                await this.userService.lockUser(req.params.id, req.user.userId);
                res.json({ success: true, message: 'User locked successfully' });
            }
            catch (error) {
                next(error);
            }
        };
        this.unlockUser = async (req, res, next) => {
            try {
                await this.userService.unlockUser(req.params.id, req.user.userId);
                res.json({ success: true, message: 'User unlocked successfully' });
            }
            catch (error) {
                next(error);
            }
        };
        this.resetPassword = async (req, res, next) => {
            try {
                const { newPassword } = req.body;
                const { AuthService } = await Promise.resolve().then(() => __importStar(require('../services/AuthService')));
                const authService = new AuthService();
                await authService.resetPassword(req.params.id, newPassword, req.user.userId);
                res.json({ success: true, message: 'Password reset successfully' });
            }
            catch (error) {
                next(error);
            }
        };
        this.getStaffList = async (_req, res, next) => {
            try {
                const staff = await this.userService.getStaffList();
                res.json({ success: true, data: staff });
            }
            catch (error) {
                next(error);
            }
        };
        this.userService = new UserService_1.UserService();
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map