import { env } from '../config/env.js';
import { ProviderError } from '../types/chat.types.js';
import type {
  NormalizedChatRequest,
  NormalizedChatResponse,
  ProviderId,
  ProviderInfo,
} from '../types/chat.types.js';
import type { LLMProviderAdapter } from './adapter.interface.js';
import { logger } from '../utils/logger.js';

interface OpenRouterAdapterConfig {
  id: ProviderId;
  displayName: string;
  model: string;
  apiKey: string;
}

/**
 * Single reusable adapter for all OpenRouter-hosted models.
 * OpenRouter is fully OpenAI-compatible, so we use the same
 * fetch + SSE parsing for GPT, Llama, and Gemma.
 */
export class OpenRouterAdapter implements LLMProviderAdapter {
  readonly id: ProviderId;
  readonly displayName: string;
  readonly defaultModel: string;
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(config: OpenRouterAdapterConfig) {
    this.id = config.id;
    this.displayName = config.displayName;
    this.defaultModel = config.model;
    this.apiKey = config.apiKey;
    this.baseUrl = env.OPENROUTER_BASE_URL;
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  getInfo(): ProviderInfo {
    return {
      id: this.id,
      displayName: this.displayName,
      model: this.defaultModel,
      configured: this.isConfigured(),
    };
  }

  async streamChat(
    request: NormalizedChatRequest,
    onChunk: (chunk: string) => void,
    signal: AbortSignal,
  ): Promise<NormalizedChatResponse> {
    if (!this.isConfigured()) {
      throw new ProviderError(
        'PROVIDER_NOT_CONFIGURED',
        `${this.displayName} API key is not configured.`,
        404,
      );
    }

    const url = `${this.baseUrl}/chat/completions`;
    const body = {
      model: request.model ?? this.defaultModel,
      messages: request.messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens,
      stream: true,
    };

    let fullText = '';
    let finishReason: 'stop' | 'length' | 'error' = 'stop';
    let usage: NormalizedChatResponse['usage'] = {};

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'PolyChat',
        },
        body: JSON.stringify(body),
        signal,
      });

      if (!response.ok) {
        const errBody = await response.text().catch(() => '');
        logger.error({ provider: this.id, status: response.status, errBody }, 'OpenRouter HTTP error');

        if (response.status === 401 || response.status === 403) {
          throw new ProviderError('INVALID_API_KEY', `${this.displayName} API key is invalid or expired.`, 401);
        }
        if (response.status === 429) {
          throw new ProviderError('RATE_LIMITED', `${this.displayName} rate limit exceeded.`, 429);
        }
        throw new ProviderError(
          'PROVIDER_ERROR',
          `${this.displayName} returned status ${response.status}: ${errBody.slice(0, 200)}`,
          502,
        );
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;
          if (!trimmed.startsWith('data: ')) continue;

          try {
            const json = JSON.parse(trimmed.slice(6));
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              fullText += delta;
              onChunk(delta);
            }
            const reason = json.choices?.[0]?.finish_reason;
            if (reason === 'stop') finishReason = 'stop';
            else if (reason === 'length') finishReason = 'length';
            if (json.usage) {
              usage = {
                promptTokens: json.usage.prompt_tokens,
                completionTokens: json.usage.completion_tokens,
              };
            }
          } catch {
            // skip malformed SSE lines
          }
        }
      }
    } catch (err: any) {
      if (err instanceof ProviderError) throw err;
      if (err?.name === 'AbortError') {
        const reason = (signal as any).reason;
        if (reason === 'client_disconnect') {
          // User clicked Stop — return partial text cleanly, no error
          logger.debug({ provider: this.id }, 'Stream aborted by client disconnect');
          return { fullText, finishReason: 'stop', usage };
        }
        // Server-side timeout
        throw new ProviderError('PROVIDER_TIMEOUT', `${this.displayName} request timed out.`, 408);
      }
      logger.error({ provider: this.id, err }, 'OpenRouter stream error');
      throw new ProviderError(
        'PROVIDER_ERROR',
        `${this.displayName} error: ${err?.message ?? 'Unknown error'}`,
        502,
      );
    }

    return { fullText, finishReason, usage };
  }
}
