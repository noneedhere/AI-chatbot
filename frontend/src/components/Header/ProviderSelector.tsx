import { useChat } from '../../hooks/useChat';

/**
 * With only one provider (GPT), this shows a static model badge
 * instead of a dropdown — no need to select anything.
 */
export default function ProviderSelector() {
  const { availableProviders, isLoading } = useChat();
  const provider = availableProviders[0];

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border
                  border-gray-200 dark:border-white/10
                  bg-gray-50 dark:bg-white/5
                  text-sm font-medium text-gray-800 dark:text-gray-200
                  ${isLoading ? 'opacity-60' : ''}`}
    >
      {/* Status dot */}
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
        provider?.configured ? 'bg-green-500' : 'bg-red-400'
      }`} />

      {/* Emoji + name */}
      <span>🤖</span>
      <span className="hidden sm:inline">
        {provider?.displayName ?? 'ChatGPT'}
      </span>

      {/* Model slug */}
      <span className="hidden md:inline text-xs text-gray-400 dark:text-gray-500 font-normal">
        · {provider?.model.split('/').pop() ?? 'gpt-oss-120b'}
      </span>

      {/* Configured badge */}
      {provider && !provider.configured && (
        <span className="text-xs text-red-500 font-medium">Not configured</span>
      )}
    </div>
  );
}
