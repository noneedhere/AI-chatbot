import { useChat } from '../../hooks/useChat';

const SUGGESTIONS = [
  'Explain quantum computing in simple terms',
  'Write a Python function to sort a list of dictionaries',
  'What are the key differences between REST and GraphQL?',
];

export default function EmptyState() {
  const { sendMessage, selectedProvider, availableProviders } = useChat();
  const provider = availableProviders.find((p) => p.id === selectedProvider);

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-12 text-center">
      {/* Gradient orb */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-brand-600/30">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3-3-3z" />
          </svg>
        </div>
        <div className="absolute -inset-2 bg-gradient-to-br from-brand-500/20 to-purple-600/20 rounded-3xl blur-xl" />
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
        Start a conversation
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mb-2">
        {provider?.configured
          ? `Chatting with ${provider.displayName} — ${provider.model}`
          : 'Select a configured AI provider from the dropdown above to begin.'}
      </p>

      {/* Suggestion chips */}
      {provider?.configured && (
        <div className="flex flex-col gap-2 w-full max-w-md mt-6">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10
                        bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10
                        text-sm text-gray-700 dark:text-gray-300 text-left
                        transition-all duration-150 hover:border-brand-500/50 hover:shadow-sm
                        active:scale-[0.99]"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
