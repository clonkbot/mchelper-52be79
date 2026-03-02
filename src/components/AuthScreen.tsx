import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Mail, Lock, Eye, EyeOff, Sparkles, User } from "lucide-react";

export function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn"
        ? "Oops! Wrong email or password. Try again, friend!"
        : "Hmm, couldn't create your account. Maybe try a different email?");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymous = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("anonymous");
    } catch {
      setError("Couldn't sign you in as a guest. Please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="relative inline-block">
            <div className="w-20 h-20 md:w-28 md:h-28 mx-auto mb-4 md:mb-6 animate-float">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
                <defs>
                  <linearGradient id="archGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFC72C" />
                    <stop offset="100%" stopColor="#FFB800" />
                  </linearGradient>
                </defs>
                <path
                  d="M10 80 Q25 20 50 20 Q75 20 90 80"
                  fill="none"
                  stroke="url(#archGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                <path
                  d="M30 80 Q40 40 50 40 Q60 40 70 80"
                  fill="none"
                  stroke="url(#archGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4">
              <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-amber-400 animate-pulse" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-display font-bold text-amber-900 mb-2">
            McHelper
          </h1>
          <p className="text-amber-700 text-base md:text-lg">
            Your friendly McDonald's ordering buddy! 🍔
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl shadow-amber-200/50 p-6 md:p-8 border border-amber-100">
          <h2 className="text-xl md:text-2xl font-bold text-center text-amber-900 mb-4 md:mb-6 font-display">
            {flow === "signIn" ? "Welcome Back!" : "Join the Fun!"}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
              <input
                name="email"
                type="email"
                placeholder="your@email.com"
                required
                className="w-full pl-12 pr-4 py-3 md:py-4 bg-amber-50 border-2 border-amber-200 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all text-amber-900 placeholder:text-amber-400 text-sm md:text-base"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                minLength={6}
                className="w-full pl-12 pr-12 py-3 md:py-4 bg-amber-50 border-2 border-amber-200 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all text-amber-900 placeholder:text-amber-400 text-sm md:text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500 hover:text-amber-700 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <input name="flow" type="hidden" value={flow} />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 md:py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-300/50 hover:shadow-xl hover:shadow-red-300/50 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none text-sm md:text-base"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Loading...
                </span>
              ) : flow === "signIn" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-4 md:mt-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-amber-200" />
            <span className="text-amber-500 text-xs md:text-sm">or</span>
            <div className="flex-1 h-px bg-amber-200" />
          </div>

          <button
            onClick={handleAnonymous}
            disabled={isLoading}
            className="mt-4 w-full py-3 md:py-4 bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold rounded-xl border-2 border-amber-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm md:text-base"
          >
            <User className="w-5 h-5" />
            Continue as Guest
          </button>

          <p className="mt-4 md:mt-6 text-center text-amber-700 text-sm md:text-base">
            {flow === "signIn" ? (
              <>
                New here?{" "}
                <button
                  onClick={() => setFlow("signUp")}
                  className="text-red-600 font-semibold hover:underline"
                >
                  Sign up!
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setFlow("signIn")}
                  className="text-red-600 font-semibold hover:underline"
                >
                  Sign in!
                </button>
              </>
            )}
          </p>
        </div>

        {/* Fun tagline */}
        <p className="mt-4 md:mt-6 text-center text-amber-600 text-xs md:text-sm">
          Powered by FireCrawl API & Convex 🚀
        </p>
      </div>
    </div>
  );
}
