export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-in px-4 py-2">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center text-sm flex-shrink-0">
        🤖
      </div>
      <div className="flex items-center gap-1 px-4 py-3 bg-gray-100 dark:bg-[#2f2f2f] rounded-2xl rounded-tl-sm">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce-dot"
            style={{ animationDelay: `${i * 0.16}s` }}
          />
        ))}
      </div>
    </div>
  );
}
