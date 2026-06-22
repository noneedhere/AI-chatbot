import { useEffect, useRef } from 'react';
import type { Message } from '../types/chat.types';

const SESSION_KEY_PREFIX = 'chat_session_';

export function useSessionStorage(sessionId: string, messages: Message[]) {
  const key = `${SESSION_KEY_PREFIX}${sessionId}`;
  const isFirstRender = useRef(true);

  // Save messages whenever they change (but skip first render to avoid overwriting)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    try {
      // Only save completed messages (not streaming ones)
      const toSave = messages.filter((m) => m.status !== 'streaming');
      sessionStorage.setItem(key, JSON.stringify(toSave));
    } catch {
      // sessionStorage can fail in private mode or when full — silently ignore
    }
  }, [key, messages]);

  // Load messages for a given session key
  function loadMessages(sid: string): Message[] {
    try {
      const raw = sessionStorage.getItem(`${SESSION_KEY_PREFIX}${sid}`);
      if (!raw) return [];
      return JSON.parse(raw) as Message[];
    } catch {
      return [];
    }
  }

  function clearSession(sid: string): void {
    sessionStorage.removeItem(`${SESSION_KEY_PREFIX}${sid}`);
  }

  return { loadMessages, clearSession };
}
