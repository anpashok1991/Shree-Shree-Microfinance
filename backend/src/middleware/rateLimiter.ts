import rateLimit from 'express-rate-limit';

const isDev = process.env.NODE_ENV !== 'production';

export const apiLimiter = isDev
  ? (req: any, _res: any, next: any) => next()
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 500,
      message: { success: false, message: 'Too many requests, please try again later.' },
      standardHeaders: true,
      legacyHeaders: false,
    });

export const authLimiter = isDev
  ? (req: any, _res: any, next: any) => next()
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: { success: false, message: 'Too many login attempts, please try again later.' },
      standardHeaders: true,
      legacyHeaders: false,
    });
