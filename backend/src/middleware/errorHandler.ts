import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { AppError } from '../utils/errors';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    logger.warn(`Operational error: ${err.message}`, {
      statusCode: err.statusCode,
      stack: err.stack,
    });

    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.constructor.name === 'ValidationError' && {
        errors: (err as any).errors,
      }),
    });
    return;
  }

  logger.error(`Unexpected error: ${err.message}`, {
    stack: err.stack,
  });

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
}
