import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from '../../types/chat.types';
import { formatTimestamp } from '../../utils/formatTimestamp';

const PROVIDER_EMOJI: Record<string, string> = {
  gpt:   '🤖',
};

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';
  const isError = message.status === 'error';
  const isStreaming = message.status === 'streaming';

  return (
    <div
      className={`flex items-end gap-2.5 px-4 py-1.5 animate-fade-in ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center text-xs flex-shrink-0 mb-1">
          {PROVIDER_EMOJI[message.provider ?? 'openai'] ?? '🤖'}
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-[75%] min-w-0 ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Bubble */}
        <div
          className={`
            relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words
            ${isUser
              ? 'bg-brand-600 text-white rounded-br-sm shadow-sm shadow-brand-600/20'
              : isError
                ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded-bl-sm'
                : 'bg-gray-100 dark:bg-[#2f2f2f] text-gray-800 dark:text-gray-200 rounded-bl-sm'
            }
          `}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-code:text-brand-600 dark:prose-code:text-brand-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded">
              {message.content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              ) : (
                <span className="text-gray-400 italic">Thinking…</span>
              )}
            </div>
          )}

          {/* Streaming cursor */}
          {isStreaming && !isUser && (
            <span className="inline-block w-0.5 h-4 bg-brand-500 ml-0.5 animate-pulse align-middle" />
          )}
        </div>

        {/* Timestamp + provider label */}
        <div className={`flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-600 px-1 ${isUser ? 'flex-row-reverse' : ''}`}>
          <span>{formatTimestamp(message.timestamp)}</span>
          {!isUser && message.provider && (
            <>
              <span>·</span>
              <span className="capitalize">{message.provider}</span>
            </>
          )}
          {isStreaming && <span className="text-brand-500">· streaming</span>}
        </div>
      </div>
    </div>
  );
}
