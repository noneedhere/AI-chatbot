import type { Message, ProviderId, ChatError } from '../types/chat.types';

const API_BASE = '/api';

export interface ChatCallbacks {
  onChunk: (text: string) => void;
  onDone: (finishReason: string, usage?: object) => void;
  onError: (error: ChatError) => void;
}

export async function streamChat(
  provider: ProviderId,
  messages: Message[],
  callbacks: ChatCallbacks,
  options?: { temperature?: number; maxTokens?: number },
  signal?: AbortSignal,
): Promise<void> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify({
        provider,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        options,
      }),
      signal,
    });
  } catch (err: any) {
    // Aborted by user — treat as clean stop, not an error
    if (err?.name === 'AbortError') return;
    callbacks.onError({ code: 'PROVIDER_ERROR', message: 'Network error: Could not reach the server.' });
    return;
  }

  if (!response.ok) {
    try {
      const data = await response.json();
      callbacks.onError(data.error ?? { code: 'PROVIDER_ERROR', message: `HTTP ${response.status}` });
    } catch {
      callbacks.onError({ code: 'PROVIDER_ERROR', message: `HTTP ${response.status}` });
    }
    return;
  }

  if (!response.body) {
    callbacks.onError({ code: 'INTERNAL_ERROR', message: 'No response body from server.' });
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Check if aborted mid-stream
      if (signal?.aborted) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n\n');
      buffer = parts.pop() ?? '';

      for (const part of parts) {
        const lines = part.trim().split('\n');
        let eventType = 'message';
        let dataLine = '';

        for (const line of lines) {
          if (line.startsWith('event: ')) eventType = line.slice(7).trim();
          else if (line.startsWith('data: ')) dataLine = line.slice(6).trim();
        }

        if (!dataLine) continue;

        try {
          const json = JSON.parse(dataLine);
          if (eventType === 'chunk') callbacks.onChunk(json.text ?? '');
          else if (eventType === 'done') callbacks.onDone(json.finishReason ?? 'stop', json.usage);
          else if (eventType === 'error') callbacks.onError({ code: json.code ?? 'PROVIDER_ERROR', message: json.message ?? 'Unknown error' });
        } catch { /* skip malformed */ }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
