import { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import AutoResizeTextarea from './AutoResizeTextarea';

function SendIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  );
}

export default function InputArea() {
  const { sendMessage, stopGeneration, isLoading } = useChat();
  const [input, setInput] = useState('');

  const handleSubmit = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');
    await sendMessage(text);
  };

  return (
    <div className="flex-shrink-0 bg-white dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-white/10 px-4 py-3">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-3 px-4 py-1 rounded-2xl border border-gray-300 dark:border-white/20
                        bg-white dark:bg-[#2a2a2a] shadow-sm
                        focus-within:border-brand-500 focus-within:shadow-md focus-within:shadow-brand-500/10
                        transition-all duration-200">
          <AutoResizeTextarea
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            disabled={isLoading}
            placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
          />

          {/* Stop button — shown while generating */}
          {isLoading ? (
            <button
              onClick={stopGeneration}
              className="mb-2 flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
                         bg-red-500 hover:bg-red-600 text-white
                         transition-all duration-150 active:scale-90 animate-fade-in"
              aria-label="Stop generating"
              title="Stop generating"
            >
              <StopIcon />
            </button>
          ) : (
            /* Send button — shown when idle */
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="mb-2 flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
                         bg-brand-600 hover:bg-brand-700 text-white
                         disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-gray-400
                         transition-all duration-150 active:scale-90"
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-2">
          {isLoading
            ? 'Generating… click the stop button to cancel'
            : 'AI can make mistakes. Verify important information.'}
        </p>
      </div>
    </div>
  );
}
