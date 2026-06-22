import { useState } from 'react';
import { useChat } from '../../hooks/useChat';

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

export default function Sidebar() {
  const { newChat, clearChat, messages, sidebarOpen, toggleSidebar } = useChat();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClear = () => {
    if (messages.length === 0) return;
    setShowClearConfirm(true);
  };

  const confirmClear = () => {
    clearChat();
    setShowClearConfirm(false);
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed md:relative inset-y-0 left-0 z-30 md:z-auto
          w-64 flex-shrink-0 flex flex-col
          bg-gray-50 dark:bg-[#212121] border-r border-gray-200 dark:border-white/10
          transition-transform duration-250 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:-translate-x-full'}
        `}
      >
        <div className="flex flex-col gap-2 p-3 pt-16 md:pt-3 flex-1">
          {/* New Chat */}
          <button
            onClick={newChat}
            className="btn-primary w-full justify-center"
          >
            <PlusIcon />
            New Chat
          </button>

          {/* Clear Chat */}
          <button
            onClick={handleClear}
            disabled={messages.length === 0}
            className="btn-ghost w-full justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-30"
          >
            <TrashIcon />
            Clear Chat
          </button>

          <div className="flex-1" />

          {/* Footer info */}
          <div className="text-xs text-gray-400 dark:text-gray-600 text-center pb-2">
            <p>Session history saved in browser.</p>
            <p>Cleared when tab closes.</p>
          </div>
        </div>
      </aside>

      {/* Clear confirmation modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card shadow-2xl max-w-sm w-full p-6 animate-fade-in">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-2">Clear chat?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              All messages in this conversation will be removed. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="btn-ghost flex-1 justify-center"
              >
                Cancel
              </button>
              <button
                onClick={confirmClear}
                className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
