import type { ProviderInfo } from '../types/chat.types.js';
import { providerRegistry } from '../adapters/provider.registry.js';

export class ProviderService {
  getAll(): ProviderInfo[] {
    return providerRegistry.getAllInfo();
  }
}

export const providerService = new ProviderService();
