import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { AuthService } from '../services/AuthService';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.headers['user-agent'];
      const result = await this.authService.login(email, password, ipAddress, userAgent);
      res.json({ success: true, message: 'Login successful', data: result });
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { UserService } = await import('../services/UserService');
      const userService = new UserService();
      const user = await userService.getUserById(req.user!.userId);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { currentPassword, newPassword } = req.body;
      await this.authService.changePassword(req.user!.userId, currentPassword, newPassword);
      res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
      next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.register(req.body);
      res.status(201).json({ success: true, message: 'Registration successful', data: result });
    } catch (error) {
      next(error);
    }
  };
}
