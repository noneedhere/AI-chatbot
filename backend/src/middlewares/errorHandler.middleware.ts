import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ProviderError } from '../types/chat.types.js';
import type { ChatErrorCode } from '../types/chat.types.js';
import { logger } from '../utils/logger.js';

interface ErrorResponse {
  error: {
    code: ChatErrorCode;
    message: string;
    details: unknown;
  };
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  logger.error({ err, path: req.path, method: req.method }, 'Request error');

  if (err instanceof ProviderError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: null,
      },
    } satisfies ErrorResponse);
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        code: 'INVALID_REQUEST' as ChatErrorCode,
        message: 'Request validation failed.',
        details: err.flatten().fieldErrors,
      },
    } satisfies ErrorResponse);
    return;
  }

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR' as ChatErrorCode,
      message: 'An unexpected error occurred.',
      details: null,
    },
  } satisfies ErrorResponse);
}
