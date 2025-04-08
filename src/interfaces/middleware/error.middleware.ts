import { Request, Response, NextFunction } from 'express';
import logger from '../../infrastructure/logging/logger';
import config from '../../infrastructure/config/config';

export interface AppError extends Error {
  status?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const status = err.status || 500;
  const message = status === 500 && config.isProduction
    ? 'Internal Server Error'
    : err.message;

  logger.error(`Error ${status}: ${err.message}`);

  res.status(status).json({
    error: {
      status,
      message,
      ...(err.code && { code: err.code }),
    },
  });
}; 