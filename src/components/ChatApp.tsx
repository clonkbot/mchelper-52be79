import { useState, useEffect } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { ChatMessage } from "./ChatMessage";
import {
  Send,
  Plus,
  LogOut,
  MessageSquare,
  Trash2,
  Menu,
  X,
  Sparkles
} from "lucide-react";

interface Conversation {
  _id: Id<"conversations">;
  title: string;
  userId: Id<"users">;
  createdAt: number;
}

interface Message {
  _id: Id<"messages">;
  conversationId: Id<"conversations">;
  userId: Id<"users">;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

export function ChatApp() {
  const { signOut } = useAuthActions();
  const conversations = useQuery(api.conversations.list);
  const createConversation = useMutation(api.conversations.create);
  const deleteConversation = useMutation(api.conversations.remove);
  const sendMessage = useMutation(api.messages.send);
  const getRecommendation = useAction(api.agent.getRecommendation);

  const [activeConversationId, setActiveConversationId] = useState<Id<"conversations"> | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const messages = useQuery(
    api.messages.list,
    activeConversationId ? { conversationId: activeConversationId } : "skip"
  );

  // Auto-select first conversation or create one
  useEffect(() => {
    if (conversations && conversations.length > 0 && !activeConversationId) {
      setActiveConversationId(conversations[0]._id);
    }
  }, [conversations, activeConversationId]);

  const handleNewChat = async () => {
    const id = await createConversation({ title: "New Chat" });
    setActiveConversationId(id);
    setShowSidebar(false);
  };

  const handleDeleteConversation = async (id: Id<"conversations">) => {
    await deleteConversation({ id });
    if (activeConversationId === id) {
      setActiveConversationId(conversations?.[0]?._id ?? null);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !activeConversationId || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      // Send user message
      await sendMessage({
        conversationId: activeConversationId,
        content: userMessage,
      });

      // Get agent recommendation
      await getRecommendation({
        conversationId: activeConversationId,
        userMessage,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    "What should I order?",
    "I'm on a budget",
    "Something healthy",
    "I want chicken!",
  ];

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Mobile menu overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
        w-72 bg-white/90 backdrop-blur-lg border-r border-amber-100
        flex flex-col transform transition-transform duration-300
        ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-amber-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path d="M10 80 Q25 20 50 20 Q75 20 90 80" fill="none" stroke="#FFC72C" strokeWidth="12" strokeLinecap="round"/>
                  <path d="M30 80 Q40 40 50 40 Q60 40 70 80" fill="none" stroke="#FFC72C" strokeWidth="12" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="font-display font-bold text-amber-900 text-lg">McHelper</span>
            </div>
            <button
              onClick={() => setShowSidebar(false)}
              className="lg:hidden p-2 hover:bg-amber-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-amber-700" />
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-amber-900 font-bold rounded-xl shadow-lg shadow-amber-200/50 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            New Chat
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-4 pt-0 space-y-2">
          {(conversations as Conversation[] | undefined)?.map((conv) => (
            <div
              key={conv._id}
              className={`group relative rounded-xl transition-all cursor-pointer ${
                activeConversationId === conv._id
                  ? "bg-amber-100 shadow-md"
                  : "hover:bg-amber-50"
              }`}
            >
              <button
                onClick={() => {
                  setActiveConversationId(conv._id);
                  setShowSidebar(false);
                }}
                className="w-full p-3 pr-10 text-left flex items-center gap-3"
              >
                <MessageSquare className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <span className="truncate text-amber-800 text-sm font-medium">
                  {conv.title}
                </span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteConversation(conv._id);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))}

          {conversations?.length === 0 && (
            <p className="text-center text-amber-500 text-sm py-8">
              No chats yet! Start a new one! 🍟
            </p>
          )}
        </div>

        {/* Sign Out */}
        <div className="p-4 border-t border-amber-100">
          <button
            onClick={() => signOut()}
            className="w-full py-3 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-amber-100 p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSidebar(true)}
              className="lg:hidden p-2 hover:bg-amber-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-amber-700" />
            </button>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-200/50 flex-shrink-0">
                <span className="text-xl md:text-2xl">🍔</span>
              </div>
              <div className="min-w-0">
                <h2 className="font-display font-bold text-amber-900 text-lg md:text-xl truncate">McHelper Agent</h2>
                <p className="text-amber-600 text-xs md:text-sm">Your friendly ordering buddy</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-700 text-xs font-medium">Online</span>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {!activeConversationId ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 opacity-50">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path d="M10 80 Q25 20 50 20 Q75 20 90 80" fill="none" stroke="#FFC72C" strokeWidth="12" strokeLinecap="round"/>
                    <path d="M30 80 Q40 40 50 40 Q60 40 70 80" fill="none" stroke="#FFC72C" strokeWidth="12" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className="text-amber-600 text-base md:text-lg">Start a new chat to begin!</p>
                <button
                  onClick={handleNewChat}
                  className="mt-4 px-6 py-3 bg-amber-400 hover:bg-amber-500 text-amber-900 font-bold rounded-xl transition-colors"
                >
                  New Chat
                </button>
              </div>
            </div>
          ) : messages?.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="text-center max-w-md px-4">
                <div className="w-20 h-20 md:w-28 md:h-28 mx-auto mb-4 md:mb-6 animate-float">
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
                    <path d="M10 80 Q25 20 50 20 Q75 20 90 80" fill="none" stroke="#FFC72C" strokeWidth="12" strokeLinecap="round"/>
                    <path d="M30 80 Q40 40 50 40 Q60 40 70 80" fill="none" stroke="#FFC72C" strokeWidth="12" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-display font-bold text-amber-900 mb-2">
                  Howdy, friend! 👋
                </h3>
                <p className="text-amber-700 mb-6 text-sm md:text-base">
                  I'm McHelper, your friendly McDonald's ordering assistant! Tell me what you're craving and I'll help you find the perfect meal!
                </p>

                {/* Quick Prompts */}
                <div className="flex flex-wrap justify-center gap-2">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => {
                        setInput(prompt);
                      }}
                      className="px-3 md:px-4 py-2 bg-white/80 hover:bg-white border-2 border-amber-200 hover:border-amber-400 rounded-xl text-amber-800 text-xs md:text-sm font-medium transition-all flex items-center gap-1 md:gap-2"
                    >
                      <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-amber-500" />
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {(messages as Message[] | undefined)?.map((message) => (
                <ChatMessage key={message._id} message={message} />
              ))}

              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-lg">🍔</span>
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-md max-w-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input Area */}
        {activeConversationId && (
          <div className="bg-white/80 backdrop-blur-lg border-t border-amber-100 p-3 md:p-4">
            <div className="flex gap-2 md:gap-3 max-w-4xl mx-auto">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me what to order..."
                rows={1}
                className="flex-1 px-4 py-3 bg-amber-50 border-2 border-amber-200 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all resize-none text-amber-900 placeholder:text-amber-400 text-sm md:text-base"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="px-4 md:px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-300/50 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-center text-amber-500/70 text-xs mt-2">
              Press Enter to send · McHelper uses FireCrawl API for menu data
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
