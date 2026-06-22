import { useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import EmptyState from './EmptyState';

export default function MessageList() {
  const { messages, isLoading } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const userScrolledUp = useRef(false);

  // Track manual scroll-up to preserve position
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleScroll = () => {
      const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      userScrolledUp.current = distFromBottom > 80;
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll to bottom when new messages/chunks arrive
  useEffect(() => {
    if (!userScrolledUp.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Also scroll on loading state change (new streaming message added)
  useEffect(() => {
    if (isLoading) {
      userScrolledUp.current = false;
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isLoading]);

  const showTypingIndicator =
    isLoading && (messages.length === 0 || messages[messages.length - 1]?.role === 'user');

  if (messages.length === 0 && !isLoading) {
    return <EmptyState />;
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto py-4 space-y-1"
    >
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {showTypingIndicator && <TypingIndicator />}

      <div ref={bottomRef} className="h-1" />
    </div>
  );
}
