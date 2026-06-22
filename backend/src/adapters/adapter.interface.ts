import type {
  NormalizedChatRequest,
  NormalizedChatResponse,
  ProviderId,
  ProviderInfo,
} from '../types/chat.types.js';

/**
 * Core interface every provider adapter must implement.
 * Adding a new provider = create 1 file implementing this + register in registry.
 */
export interface LLMProviderAdapter {
  readonly id: ProviderId;
  readonly displayName: string;
  readonly defaultModel: string;

  /** Returns true when the adapter has sufficient config to make requests */
  isConfigured(): boolean;

  /** Returns provider info for the /api/providers endpoint */
  getInfo(): ProviderInfo;

  /**
   * Stream a chat completion to the client.
   * @param request  Normalized chat request
   * @param onChunk  Called with each text chunk as it arrives
   * @param signal   AbortSignal for timeout/cancellation
   */
  streamChat(
    request: NormalizedChatRequest,
    onChunk: (chunk: string) => void,
    signal: AbortSignal,
  ): Promise<NormalizedChatResponse>;
}
