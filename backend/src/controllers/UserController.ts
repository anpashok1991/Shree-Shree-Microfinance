import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { UserService } from '../services/UserService';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  createUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.createUser({
        ...req.body,
        createdById: req.user!.userId,
      });
      res.status(201).json({ success: true, message: 'User created successfully', data: user });
    } catch (error) {
      next(error);
    }
  };

  getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = req.query;
      const result = await this.userService.getUsers(
        page ? parseInt(page as string) : undefined,
        limit ? parseInt(limit as string) : undefined
      );
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUserById(req.params.id as string);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.updateUser(req.params.id as string, req.body, req.user!.userId);
      res.json({ success: true, message: 'User updated successfully', data: user });
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.userService.deleteUser(req.params.id as string, req.user!.userId);
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  toggleStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { status } = req.body;
      await this.userService.toggleUserStatus(req.params.id as string, status, req.user!.userId);
      res.json({ success: true, message: `User ${status === 'ACTIVE' ? 'activated' : 'deactivated'} successfully` });
    } catch (error) {
      next(error);
    }
  };

  lockUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.userService.lockUser(req.params.id as string, req.user!.userId);
      res.json({ success: true, message: 'User locked successfully' });
    } catch (error) {
      next(error);
    }
  };

  unlockUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.userService.unlockUser(req.params.id as string, req.user!.userId);
      res.json({ success: true, message: 'User unlocked successfully' });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { newPassword } = req.body;
      const { AuthService } = await import('../services/AuthService');
      const authService = new AuthService();
      await authService.resetPassword(req.params.id as string, newPassword, req.user!.userId);
      res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
      next(error);
    }
  };

  getStaffList = async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const staff = await this.userService.getStaffList();
      res.json({ success: true, data: staff });
    } catch (error) {
      next(error);
    }
  };
}
