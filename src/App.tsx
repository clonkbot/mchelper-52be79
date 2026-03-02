import { useConvexAuth } from "convex/react";
import { AuthScreen } from "./components/AuthScreen";
import { ChatApp } from "./components/ChatApp";
import "./styles.css";

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 animate-bounce-slow">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
                <path
                  d="M10 80 Q25 20 50 20 Q75 20 90 80"
                  fill="none"
                  stroke="#FFC72C"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                <path
                  d="M30 80 Q40 40 50 40 Q60 40 70 80"
                  fill="none"
                  stroke="#FFC72C"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-amber-800 font-display">
              Loading McHelper...
            </h1>
            <p className="text-amber-600 mt-2 text-sm md:text-base">Warming up the fryers! 🍟</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-red-50 flex flex-col">
      {isAuthenticated ? <ChatApp /> : <AuthScreen />}

      {/* Footer */}
      <footer className="py-3 md:py-4 text-center border-t border-amber-200/50 bg-white/30 backdrop-blur-sm">
        <p className="text-xs text-amber-700/50 font-medium">
          Requested by <span className="text-amber-800/60">@web-user</span> · Built by <span className="text-amber-800/60">@clonkbot</span>
        </p>
      </footer>
    </div>
  );
}
