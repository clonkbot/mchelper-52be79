interface Message {
  _id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";

  // Parse markdown-style formatting
  const formatContent = (content: string) => {
    const lines = content.split("\n");

    return lines.map((line, i) => {
      // Headers
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <p key={i} className="font-bold text-amber-900 mt-3 first:mt-0">
            {line.replace(/\*\*/g, "")}
          </p>
        );
      }

      // Bullet points with emojis
      if (line.startsWith("•") || line.startsWith("-")) {
        const text = line.replace(/^[•-]\s*/, "");
        // Check for **bold** inline
        const parts = text.split(/(\*\*[^*]+\*\*)/);
        return (
          <p key={i} className="ml-4 my-1 flex items-start gap-2">
            <span className="text-amber-500">•</span>
            <span>
              {parts.map((part, j) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                  return <strong key={j} className="text-amber-800">{part.replace(/\*\*/g, "")}</strong>;
                }
                return <span key={j}>{part}</span>;
              })}
            </span>
          </p>
        );
      }

      // Regular lines with inline bold
      if (line.includes("**")) {
        const parts = line.split(/(\*\*[^*]+\*\*)/);
        return (
          <p key={i} className="my-1">
            {parts.map((part, j) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={j} className="text-amber-800">{part.replace(/\*\*/g, "")}</strong>;
              }
              return <span key={j}>{part}</span>;
            })}
          </p>
        );
      }

      // Empty lines
      if (!line.trim()) {
        return <div key={i} className="h-2" />;
      }

      return <p key={i} className="my-1">{line}</p>;
    });
  };

  if (isAssistant) {
    return (
      <div className="flex items-start gap-2 md:gap-3 animate-fade-in">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-200/50 flex-shrink-0">
          <span className="text-base md:text-lg">🍔</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-md border border-amber-100 max-w-full md:max-w-2xl">
            <div className="text-amber-800 text-sm md:text-base leading-relaxed overflow-x-auto">
              {formatContent(message.content)}
            </div>
          </div>
          <p className="text-xs text-amber-400 mt-1 ml-2">
            McHelper · {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 md:gap-3 justify-end animate-fade-in">
      <div className="flex-1 flex flex-col items-end min-w-0">
        <div className="bg-gradient-to-r from-amber-400 to-yellow-400 rounded-2xl rounded-tr-md px-4 py-3 shadow-md max-w-full md:max-w-md">
          <p className="text-amber-900 text-sm md:text-base break-words">{message.content}</p>
        </div>
        <p className="text-xs text-amber-400 mt-1 mr-2">
          You · {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
        <span className="text-base md:text-lg">👤</span>
      </div>
    </div>
  );
}
