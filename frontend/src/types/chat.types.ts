export type ProviderId = 'gpt' | 'nemotron' | 'gemma';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  provider?: ProviderId;
  timestamp: number;
  status: 'complete' | 'streaming' | 'error';
}

export interface ProviderInfo {
  id: ProviderId;
  displayName: string;
  model: string;
  configured: boolean;
}

export interface ChatError {
  code: string;
  message: string;
}

export interface ChatState {
  messages: Message[];
  selectedProvider: ProviderId;
  availableProviders: ProviderInfo[];
  isLoading: boolean;
  error: ChatError | null;
  sessionId: string;
  sidebarOpen: boolean;
}

export type ChatAction =
  | { type: 'ADD_USER_MESSAGE'; payload: Message }
  | { type: 'ADD_ASSISTANT_MESSAGE'; payload: Message }
  | { type: 'APPEND_CHUNK'; payload: { id: string; chunk: string } }
  | { type: 'COMPLETE_MESSAGE'; payload: { id: string } }
  | { type: 'ERROR_MESSAGE'; payload: { id: string; error: ChatError } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: ChatError | null }
  | { type: 'SET_PROVIDERS'; payload: ProviderInfo[] }
  | { type: 'SET_PROVIDER'; payload: ProviderId }
  | { type: 'NEW_CHAT' }
  | { type: 'CLEAR_CHAT' }
  | { type: 'RESTORE_MESSAGES'; payload: Message[] }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR'; payload: boolean };
