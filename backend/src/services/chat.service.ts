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
  /**
   * @param provider        Provider ID to route to
   * @param request         Normalized chat request
   * @param onChunk         Callback called with each streamed text chunk
   * @param externalSignal  Optional AbortSignal from the HTTP layer (client disconnect)
   */
  async streamChat(
    provider: ProviderId,
    request: NormalizedChatRequest,
    onChunk: (chunk: string) => void,
    externalSignal?: AbortSignal,
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

    // Internal timeout controller
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(
      () => timeoutController.abort('timeout'),
      env.PROVIDER_TIMEOUT_MS,
    );

    // Combine timeout + client-disconnect signals (Node.js 20+ AbortSignal.any)
    const combinedSignal = externalSignal
      ? AbortSignal.any([timeoutController.signal, externalSignal])
      : timeoutController.signal;

    try {
      logger.info(
        { provider, model: request.model ?? adapter.defaultModel, messageCount: request.messages.length },
        'Chat request started',
      );

      const result = await adapter.streamChat(request, onChunk, combinedSignal);

      logger.info(
        { provider, finishReason: result.finishReason, usage: result.usage },
        'Chat request completed',
      );

      return result;
    } catch (err) {
      // If the client disconnected, swallow the error — it's expected, not a bug
      if (externalSignal?.aborted) {
        logger.debug({ provider }, 'Request aborted by client disconnect');
        return { fullText: '', finishReason: 'stop', usage: {} };
      }
      logger.error({ provider, err }, 'Chat request failed');
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

export const chatService = new ChatService();
