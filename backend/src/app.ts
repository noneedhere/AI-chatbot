import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import chatRoutes from './routes/chat.routes.js';
import providerRoutes from './routes/provider.routes.js';
import healthRoutes from './routes/health.routes.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import { logger } from './utils/logger.js';

export function createApp() {
  const app = express();

  // CORS
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Accept'],
    }),
  );

  // Body parsing
  app.use(express.json({ limit: '1mb' }));

  // Request logging
  app.use((req, _res, next) => {
    logger.debug({ method: req.method, path: req.path }, 'Incoming request');
    next();
  });

  // Routes
  app.use('/api/health', healthRoutes);
  app.use('/api/providers', providerRoutes);
  app.use('/api/chat', chatRoutes);

  // 404 fallback
  app.use((_req, res) => {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found.', details: null } });
  });

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}
