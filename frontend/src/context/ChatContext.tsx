import React, { createContext, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ChatState, ChatAction, ProviderId } from '../types/chat.types';

const initialState: ChatState = {
  messages: [],
  selectedProvider: 'gpt',
  availableProviders: [],
  isLoading: false,
  error: null,
  sessionId: uuidv4(),
  // Default open on desktop (≥768px), closed on mobile
  sidebarOpen: typeof window !== 'undefined' && window.innerWidth >= 768,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_USER_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload], error: null };

    case 'ADD_ASSISTANT_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };

    case 'APPEND_CHUNK':
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.payload.id
            ? { ...m, content: m.content + action.payload.chunk, status: 'streaming' }
            : m,
        ),
      };

    case 'COMPLETE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.payload.id ? { ...m, status: 'complete' } : m,
        ),
        isLoading: false,
      };

    case 'ERROR_MESSAGE':
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.payload.id ? { ...m, status: 'error', content: action.payload.error.message } : m,
        ),
        isLoading: false,
        error: action.payload.error,
      };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'SET_PROVIDERS':
      return {
        ...state,
        availableProviders: action.payload,
        // Auto-select first configured provider if current selection not configured
        selectedProvider:
          action.payload.find((p) => p.id === state.selectedProvider && p.configured)?.id ??
          (action.payload.find((p) => p.configured)?.id as ProviderId | undefined) ??
          state.selectedProvider,
      };

    case 'SET_PROVIDER':
      return { ...state, selectedProvider: action.payload };

    case 'NEW_CHAT':
      return {
        ...initialState,
        availableProviders: state.availableProviders,
        selectedProvider: state.selectedProvider,
        sessionId: uuidv4(),
        sidebarOpen: state.sidebarOpen,
      };

    case 'CLEAR_CHAT':
      return {
        ...state,
        messages: [],
        error: null,
        isLoading: false,
      };

    case 'RESTORE_MESSAGES':
      return { ...state, messages: action.payload };

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };

    case 'SET_SIDEBAR':
      return { ...state, sidebarOpen: action.payload };

    default:
      return state;
  }
}

export interface ChatContextValue {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
}

export const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
}
