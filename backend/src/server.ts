import { createApp } from './app.js';
import { env } from './config/env.js';
import { initializeRegistry } from './adapters/provider.registry.js';
import { logger } from './utils/logger.js';

async function main() {
  // Initialize provider registry (runs Ollama health check)
  await initializeRegistry();

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on http://localhost:${env.PORT}`);
    logger.info(`CORS origin: ${env.CORS_ORIGIN}`);
    logger.info(`Provider timeout: ${env.PROVIDER_TIMEOUT_MS}ms`);
    logger.info(`Rate limit: ${env.RATE_LIMIT_PER_MINUTE} req/min`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received — shutting down gracefully');
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT received — shutting down gracefully');
    server.close(() => {
      process.exit(0);
    });
  });
}

main().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
