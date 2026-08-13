import type { ProviderId, ProviderInfo } from '../types/chat.types.js';
import type { LLMProviderAdapter } from './adapter.interface.js';
import { OpenRouterAdapter } from './openrouter.adapter.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

class ProviderRegistry {
  private adapters = new Map<ProviderId, LLMProviderAdapter>();

  register(adapter: LLMProviderAdapter): void {
    this.adapters.set(adapter.id, adapter);
    logger.debug({ provider: adapter.id }, 'Provider registered');
  }

  get(id: ProviderId): LLMProviderAdapter | undefined {
    return this.adapters.get(id);
  }

  getAll(): LLMProviderAdapter[] {
    return Array.from(this.adapters.values());
  }

  getAllInfo(): ProviderInfo[] {
    return this.getAll().map((a) => a.getInfo());
  }
}

export const providerRegistry = new ProviderRegistry();

// Register GPT (OpenAI via OpenRouter)
providerRegistry.register(new OpenRouterAdapter({
  id: 'gpt',
  displayName: 'ChatGPT',
  model: env.GPT_DEFAULT_MODEL,
  apiKey: env.GPT_API_KEY ?? '',
}));

// Register NVIDIA Nemotron 3 Super via OpenRouter
providerRegistry.register(new OpenRouterAdapter({
  id: 'nemotron',
  displayName: 'Nemotron 3 Super',
  model: env.NEMOTRON_DEFAULT_MODEL,
  apiKey: env.NEMOTRON_API_KEY ?? '',
}));

// Register Google Gemma 4 26B A4B via OpenRouter
providerRegistry.register(new OpenRouterAdapter({
  id: 'gemma',
  displayName: 'Gemma 4 26B A4B',
  model: env.GEMMA_DEFAULT_MODEL,
  apiKey: env.GEMMA_API_KEY ?? '',
}));

export async function initializeRegistry(): Promise<void> {
  logger.info('Provider registry initialized — GPT, Nemotron, Gemma via OpenRouter');
}
