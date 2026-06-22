import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

export const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: env.RATE_LIMIT_PER_MINUTE,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: `Too many requests. Limit: ${env.RATE_LIMIT_PER_MINUTE} requests per minute.`,
      details: null,
    },
  },
});
