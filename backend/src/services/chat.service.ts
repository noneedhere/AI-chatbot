import { env } from '../config/env.js';
import { ProviderError } from '../types/chat.types.js';
import type {
  NormalizedChatRequest,
  NormalizedChatResponse,
  ProviderId,
} from '../types/chat.types.js';
import { providerRegistry } from '../adapters/provider.registry.js';
import { logger } from '../utils/logger.js';

export class ChatService {
  async streamChat(
    provider: ProviderId,
    request: NormalizedChatRequest,
    onChunk: (chunk: string) => void,
  ): Promise<NormalizedChatResponse> {
    const adapter = providerRegistry.get(provider);

    if (!adapter) {
      throw new ProviderError(
        'INVALID_PROVIDER',
        `Provider '${provider}' is not recognized.`,
        400,
      );
    }

    if (!adapter.isConfigured()) {
      throw new ProviderError(
        'PROVIDER_NOT_CONFIGURED',
        `Provider '${adapter.displayName}' is not configured. Check your server environment variables.`,
        404,
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), env.PROVIDER_TIMEOUT_MS);

    try {
      logger.info(
        { provider, model: request.model ?? adapter.defaultModel, messageCount: request.messages.length },
        'Chat request started',
      );

      const result = await adapter.streamChat(request, onChunk, controller.signal);

      logger.info(
        { provider, finishReason: result.finishReason, usage: result.usage },
        'Chat request completed',
      );

      return result;
    } catch (err) {
      logger.error({ provider, err }, 'Chat request failed');
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

export const chatService = new ChatService();
