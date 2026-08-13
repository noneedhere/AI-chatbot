import { useState, useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import type { ProviderId } from '../../types/chat.types';

/** Emoji + accent color per provider for visual distinction */
const providerMeta: Record<ProviderId, { emoji: string; accent: string }> = {
  gpt: { emoji: '🤖', accent: 'bg-emerald-500' },
  nemotron: { emoji: '🟢', accent: 'bg-lime-500' },
  gemma: { emoji: '💎', accent: 'bg-blue-500' },
};

/**
 * Dropdown selector that lets users switch between all registered AI providers.
 * Shows a status dot (green = configured), emoji, display name, and model slug.
 */
export default function ProviderSelector() {
  const { availableProviders, selectedProvider, setProvider, isLoading } = useChat();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = availableProviders.find((p) => p.id === selectedProvider) ?? availableProviders[0];
  const meta = current ? providerMeta[current.id] ?? { emoji: '🤖', accent: 'bg-gray-500' } : null;

  return (
    <div ref={wrapperRef} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={isLoading}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border
                    border-gray-200 dark:border-white/10
                    bg-gray-50 dark:bg-white/5
                    text-sm font-medium text-gray-800 dark:text-gray-200
                    hover:bg-gray-100 dark:hover:bg-white/10
                    transition-colors duration-150
                    ${isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                    ${open ? 'ring-2 ring-brand-500/40' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        id="provider-selector-trigger"
      >
        {/* Status dot */}
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
          current?.configured ? 'bg-green-500' : 'bg-red-400'
        }`} />

        {/* Emoji + name */}
        <span>{meta?.emoji ?? '🤖'}</span>
        <span className="hidden sm:inline">
          {current?.displayName ?? 'Select Model'}
        </span>

        {/* Model slug */}
        <span className="hidden md:inline text-xs text-gray-400 dark:text-gray-500 font-normal">
          · {current?.model.split('/').pop() ?? ''}
        </span>

        {/* Chevron */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-3.5 h-3.5 ml-1 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-72 rounded-xl border border-gray-200 dark:border-white/10
                      bg-white dark:bg-[#1e1e1e] shadow-xl shadow-black/10 dark:shadow-black/40
                      overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
          role="listbox"
          aria-labelledby="provider-selector-trigger"
          id="provider-selector-dropdown"
        >
          <div className="px-3 py-2 border-b border-gray-100 dark:border-white/5">
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              AI Models
            </span>
          </div>

          {availableProviders.map((provider) => {
            const pmeta = providerMeta[provider.id] ?? { emoji: '🤖', accent: 'bg-gray-500' };
            const isSelected = provider.id === selectedProvider;

            return (
              <button
                key={provider.id}
                onClick={() => {
                  setProvider(provider.id);
                  setOpen(false);
                }}
                disabled={!provider.configured}
                role="option"
                aria-selected={isSelected}
                id={`provider-option-${provider.id}`}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left
                            transition-colors duration-100
                            ${isSelected
                              ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}
                            ${!provider.configured ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                            `}
              >
                {/* Accent bar for selected */}
                <span className={`w-1 h-8 rounded-full flex-shrink-0 transition-colors ${
                  isSelected ? pmeta.accent : 'bg-transparent'
                }`} />

                {/* Emoji */}
                <span className="text-lg flex-shrink-0">{pmeta.emoji}</span>

                {/* Text info */}
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-medium truncate">{provider.displayName}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 truncate">
                    {provider.model}
                  </span>
                </div>

                {/* Status */}
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  provider.configured ? 'bg-green-500' : 'bg-red-400'
                }`} />

                {/* Check mark for selected */}
                {isSelected && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-brand-600 dark:text-brand-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
