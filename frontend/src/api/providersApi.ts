import type { ProviderInfo } from '../types/chat.types';

const API_BASE = '/api';

export async function fetchProviders(): Promise<ProviderInfo[]> {
  const res = await fetch(`${API_BASE}/providers`);
  if (!res.ok) {
    throw new Error(`Failed to fetch providers: ${res.status}`);
  }
  const data = await res.json();
  return data.providers as ProviderInfo[];
}
