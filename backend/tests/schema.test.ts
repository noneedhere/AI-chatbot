import { describe, it, expect } from 'vitest';
import { chatRequestSchema } from '../src/schemas/chat.schema.js';

describe('chatRequestSchema', () => {
  const validBody = {
    provider: 'gpt',
    messages: [{ role: 'user', content: 'Hello' }],
  };

  it('accepts a valid request body', () => {
    const result = chatRequestSchema.safeParse(validBody);
    expect(result.success).toBe(true);
  });

  it('accepts nemotron as a valid provider', () => {
    const result = chatRequestSchema.safeParse({ ...validBody, provider: 'nemotron' });
    expect(result.success).toBe(true);
  });

  it('accepts gemma as a valid provider', () => {
    const result = chatRequestSchema.safeParse({ ...validBody, provider: 'gemma' });
    expect(result.success).toBe(true);
  });

  it('rejects an unknown provider', () => {
    const result = chatRequestSchema.safeParse({ ...validBody, provider: 'deepseek' });
    expect(result.success).toBe(false);
  });

  it('rejects empty messages array', () => {
    const result = chatRequestSchema.safeParse({ ...validBody, messages: [] });
    expect(result.success).toBe(false);
  });

  it('rejects a message with empty content', () => {
    const result = chatRequestSchema.safeParse({
      ...validBody,
      messages: [{ role: 'user', content: '' }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid role', () => {
    const result = chatRequestSchema.safeParse({
      ...validBody,
      messages: [{ role: 'bot', content: 'Hi' }],
    });
    expect(result.success).toBe(false);
  });

  it('accepts optional temperature within range', () => {
    const result = chatRequestSchema.safeParse({
      ...validBody,
      options: { temperature: 0.5 },
    });
    expect(result.success).toBe(true);
  });

  it('rejects temperature out of range', () => {
    const result = chatRequestSchema.safeParse({
      ...validBody,
      options: { temperature: 3.0 },
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative maxTokens', () => {
    const result = chatRequestSchema.safeParse({
      ...validBody,
      options: { maxTokens: -1 },
    });
    expect(result.success).toBe(false);
  });

  it('accepts all valid roles', () => {
    for (const role of ['user', 'assistant', 'system']) {
      const result = chatRequestSchema.safeParse({
        ...validBody,
        messages: [{ role, content: 'Test' }],
      });
      expect(result.success, `role '${role}' should be valid`).toBe(true);
    }
  });
});
