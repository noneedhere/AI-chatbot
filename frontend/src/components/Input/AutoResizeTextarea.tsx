import { useRef, useEffect, type KeyboardEvent } from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}

const MAX_ROWS = 6;
const LINE_HEIGHT = 24; // px, matches text-sm leading-relaxed

export default function AutoResizeTextarea({ value, onChange, onSubmit, disabled, placeholder }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    const maxH = MAX_ROWS * LINE_HEIGHT + 24; // padding
    el.style.height = `${Math.min(el.scrollHeight, maxH)}px`;
  }, [value]);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) onSubmit();
    }
  }

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      placeholder={placeholder}
      rows={1}
      className="flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400
                 dark:placeholder-gray-600 leading-relaxed py-3 px-0 max-h-[160px] overflow-y-auto
                 focus:outline-none resize-none"
    />
  );
}
