import { useContext, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatContext } from '../context/ChatContext';
import { streamChat } from '../api/chatApi';
import { fetchProviders } from '../api/providersApi';
import { useSessionStorage } from './useSessionStorage';
import type { ProviderId } from '../types/chat.types';

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within <ChatProvider>');
  const { state, dispatch } = ctx;

  // AbortController ref — survives re-renders without causing them
  const abortControllerRef = useRef<AbortController | null>(null);

  const { loadMessages, clearSession } = useSessionStorage(state.sessionId, state.messages);

  // Load providers on mount
  useEffect(() => {
    fetchProviders()
      .then((providers) => dispatch({ type: 'SET_PROVIDERS', payload: providers }))
      .catch(() => {});
  }, [dispatch]);

  // Restore messages from sessionStorage on mount
  useEffect(() => {
    const saved = loadMessages(state.sessionId);
    if (saved.length > 0) dispatch({ type: 'RESTORE_MESSAGES', payload: saved });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || state.isLoading) return;

      const userMessage = {
        id: uuidv4(),
        role: 'user' as const,
        content: content.trim(),
        timestamp: Date.now(),
        status: 'complete' as const,
      };

      dispatch({ type: 'ADD_USER_MESSAGE', payload: userMessage });
      dispatch({ type: 'SET_LOADING', payload: true });

      const assistantId = uuidv4();
      dispatch({
        type: 'ADD_ASSISTANT_MESSAGE',
        payload: {
          id: assistantId,
          role: 'assistant',
          content: '',
          provider: state.selectedProvider,
          timestamp: Date.now(),
          status: 'streaming',
        },
      });

      // Create a fresh AbortController for this request
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const allMessages = [...state.messages, userMessage];

      await streamChat(
        state.selectedProvider,
        allMessages,
        {
          onChunk: (text) => dispatch({ type: 'APPEND_CHUNK', payload: { id: assistantId, chunk: text } }),
          onDone: () => dispatch({ type: 'COMPLETE_MESSAGE', payload: { id: assistantId } }),
          onError: (error) => {
            dispatch({ type: 'ERROR_MESSAGE', payload: { id: assistantId, error } });
            dispatch({ type: 'SET_ERROR', payload: error });
          },
        },
        undefined,
        controller.signal,
      );

      // If aborted mid-stream, mark message as complete (partial text stays)
      if (controller.signal.aborted) {
        dispatch({ type: 'COMPLETE_MESSAGE', payload: { id: assistantId } });
      }

      abortControllerRef.current = null;
    },
    [state.messages, state.isLoading, state.selectedProvider, dispatch],
  );

  const stopGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    dispatch({ type: 'SET_LOADING', payload: false });
  }, [dispatch]);

  const retryLastMessage = useCallback(() => {
    const lastUser = [...state.messages].reverse().find((m) => m.role === 'user');
    if (!lastUser) return;
    const idx = state.messages.findIndex((m) => m.id === lastUser.id);
    const trimmed = state.messages.slice(0, idx);
    dispatch({ type: 'RESTORE_MESSAGES', payload: trimmed });
    dispatch({ type: 'SET_ERROR', payload: null });
    sendMessage(lastUser.content);
  }, [state.messages, dispatch, sendMessage]);

  const newChat = useCallback(() => {
    abortControllerRef.current?.abort();
    clearSession(state.sessionId);
    dispatch({ type: 'NEW_CHAT' });
  }, [state.sessionId, clearSession, dispatch]);

  const clearChat = useCallback(() => {
    abortControllerRef.current?.abort();
    clearSession(state.sessionId);
    dispatch({ type: 'CLEAR_CHAT' });
  }, [state.sessionId, clearSession, dispatch]);

  const setProvider = useCallback(
    (id: ProviderId) => dispatch({ type: 'SET_PROVIDER', payload: id }),
    [dispatch],
  );

  const dismissError = useCallback(
    () => dispatch({ type: 'SET_ERROR', payload: null }),
    [dispatch],
  );

  const toggleSidebar = useCallback(
    () => dispatch({ type: 'TOGGLE_SIDEBAR' }),
    [dispatch],
  );

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    selectedProvider: state.selectedProvider,
    availableProviders: state.availableProviders,
    sidebarOpen: state.sidebarOpen,
    sendMessage,
    stopGeneration,
    retryLastMessage,
    newChat,
    clearChat,
    setProvider,
    dismissError,
    toggleSidebar,
  };
}
