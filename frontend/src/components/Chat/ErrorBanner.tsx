import { useChat } from '../../hooks/useChat';

const ERROR_HELP: Record<string, { title: string; detail: string; link?: string }> = {
  RATE_LIMITED: {
    title: 'Free Tier Rate Limited',
    detail:
      'This free OpenRouter model is temporarily overloaded. Wait ~1 minute and try again, or link your own provider API key at OpenRouter to get a dedicated rate limit.',
    link: 'https://openrouter.ai/settings/integrations',
  },
  INVALID_API_KEY: {
    title: 'Invalid API Key',
    detail: 'The API key for this provider is invalid or expired. Check your backend .env file.',
  },
  PROVIDER_NOT_CONFIGURED: {
    title: 'Provider Not Configured',
    detail: 'Add this provider\'s API key to your backend .env file and restart the server.',
  },
  PROVIDER_TIMEOUT: {
    title: 'Request Timed Out',
    detail: 'The AI provider took too long to respond. Try again or switch to a different model.',
  },
  PROVIDER_ERROR: {
    title: 'Provider Error',
    detail: 'The AI provider returned an unexpected error.',
  },
};

export default function ErrorBanner() {
  const { error, retryLastMessage, dismissError } = useChat();

  if (!error) return null;

  const help = ERROR_HELP[error.code] ?? { title: 'Error', detail: error.message };

  return (
    <div className="mx-4 mb-2 animate-fade-in">
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl
                      bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50">
        {/* Icon */}
        <svg className="w-4 h-4 mt-0.5 text-red-500 dark:text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">{help.title}</p>
          <p className="text-xs text-red-600 dark:text-red-300 mt-0.5 leading-relaxed">{help.detail}</p>
          {help.link && (
            <a
              href={help.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-red-700 dark:text-red-400 hover:underline"
            >
              Fix on OpenRouter →
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={retryLastMessage}
            className="text-xs font-medium px-2.5 py-1 rounded-lg
                      bg-red-100 dark:bg-red-800/40 hover:bg-red-200 dark:hover:bg-red-800/60
                      text-red-700 dark:text-red-300 transition-colors"
          >
            Retry
          </button>
          <button
            onClick={dismissError}
            className="text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
            aria-label="Dismiss error"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
