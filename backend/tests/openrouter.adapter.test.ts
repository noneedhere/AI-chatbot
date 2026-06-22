import { describe, it, expect, vi } from 'vitest';
import { OpenRouterAdapter } from '../src/adapters/openrouter.adapter.js';

// Stub env so the adapter doesn't require a real .env in tests
vi.mock('../src/config/env.js', () => ({
  env: {
    OPENROUTER_BASE_URL: 'https://openrouter.ai/api/v1',
    GPT_DEFAULT_MODEL: 'openai/gpt-oss-120b',
    PROVIDER_TIMEOUT_MS: 60000,
  },
}));

// Stub logger to silence output during tests
vi.mock('../src/utils/logger.js', () => ({
  logger: { info: vi.fn(), debug: vi.fn(), error: vi.fn(), warn: vi.fn() },
}));

describe('OpenRouterAdapter', () => {
  const makeAdapter = (apiKey: string) =>
    new OpenRouterAdapter({
      id: 'gpt',
      displayName: 'ChatGPT',
      model: 'openai/gpt-oss-120b',
      apiKey,
    });

  describe('isConfigured()', () => {
    it('returns true when apiKey is a non-empty string', () => {
      expect(makeAdapter('sk-or-v1-abc123').isConfigured()).toBe(true);
    });

    it('returns false when apiKey is an empty string', () => {
      expect(makeAdapter('').isConfigured()).toBe(false);
    });
  });

  describe('getInfo()', () => {
    it('returns correct provider info when configured', () => {
      const info = makeAdapter('sk-or-v1-abc123').getInfo();
      expect(info.id).toBe('gpt');
      expect(info.displayName).toBe('ChatGPT');
      expect(info.model).toBe('openai/gpt-oss-120b');
      expect(info.configured).toBe(true);
    });

    it('returns configured: false when key is missing', () => {
      const info = makeAdapter('').getInfo();
      expect(info.configured).toBe(false);
    });
  });

  describe('streamChat()', () => {
    it('throws PROVIDER_NOT_CONFIGURED when key is empty', async () => {
      const adapter = makeAdapter('');
      await expect(
        adapter.streamChat({ messages: [] }, vi.fn(), new AbortController().signal),
      ).rejects.toMatchObject({ code: 'PROVIDER_NOT_CONFIGURED' });
    });
  });
});
