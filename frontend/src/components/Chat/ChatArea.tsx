import MessageList from './MessageList';
import ErrorBanner from './ErrorBanner';

export default function ChatArea() {
  return (
    <main className="flex flex-col flex-1 min-h-0 bg-[#f7f7f8] dark:bg-[#212121]">
      <MessageList />
      <ErrorBanner />
    </main>
  );
}
