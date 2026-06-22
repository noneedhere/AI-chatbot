export type ProviderId = 'gpt';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface NormalizedChatRequest {
  messages: Message[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface NormalizedChatResponse {
  fullText: string;
  finishReason: 'stop' | 'length' | 'error';
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
  };
}

export interface ProviderInfo {
  id: ProviderId;
  displayName: string;
  model: string;
  configured: boolean;
}

export type ChatErrorCode =
  | 'INVALID_REQUEST'
  | 'INVALID_PROVIDER'
  | 'INVALID_API_KEY'
  | 'PROVIDER_NOT_CONFIGURED'
  | 'PROVIDER_TIMEOUT'
  | 'RATE_LIMITED'
  | 'PROVIDER_ERROR'
  | 'INTERNAL_ERROR';

export class ProviderError extends Error {
  constructor(
    public readonly code: ChatErrorCode,
    message: string,
    public readonly statusCode: number = 500,
  ) {
    super(message);
    this.name = 'ProviderError';
  }
}

export interface ChatRequestBody {
  provider: ProviderId;
  messages: Message[];
  options?: {
    temperature?: number;
    maxTokens?: number;
  };
}
