"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          router.push("/");
          router.refresh();
        } else {
          setIsLogin(true);
          setError("Account created! Please login.");
        }
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 dark:bg-sky-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Logo Section */}
        <div className="text-center mb-8">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="inline-block p-4 bg-sky-500 text-white rounded-[2rem] shadow-2xl shadow-sky-500/40 mb-4"
          >
            <Wallet size={40} />
          </motion.div>
          <h1 className="text-4xl font-black text-sky-950 dark:text-sky-50 tracking-tight">
            Expensy
          </h1>
          <p className="text-sky-400 font-bold uppercase tracking-[0.3em] text-xs mt-1">
            Sky Ledger Auth
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-sky-900/40 backdrop-blur-xl border border-sky-100 dark:border-sky-800/50 rounded-[2.5rem] p-8 shadow-2xl shadow-sky-500/5">
          <div className="flex gap-4 mb-8 bg-sky-50 dark:bg-sky-950/50 p-1.5 rounded-[1.5rem]">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-[1.2rem] text-sm font-black uppercase tracking-widest transition-all ${isLogin ? "bg-white dark:bg-sky-800 text-sky-600 dark:text-sky-50 shadow-lg" : "text-sky-400"}`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-[1.2rem] text-sm font-black uppercase tracking-widest transition-all ${!isLogin ? "bg-white dark:bg-sky-800 text-sky-600 dark:text-sky-50 shadow-lg" : "text-sky-400"}`}
            >
              Join
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative"
                >
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Full Name"
                    required={!isLogin}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-4 bg-sky-50 dark:bg-sky-950/30 border-2 border-transparent focus:border-sky-400 rounded-2xl outline-none transition-all text-sky-900 dark:text-sky-50 font-medium placeholder:text-sky-300"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400"
                size={20}
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full pl-12 pr-4 py-4 bg-sky-50 dark:bg-sky-950/30 border-2 border-transparent focus:border-sky-400 rounded-2xl outline-none transition-all text-sky-900 dark:text-sky-50 font-medium placeholder:text-sky-300"
              />
            </div>

            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400"
                size={20}
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full pl-12 pr-4 py-4 bg-sky-50 dark:bg-sky-950/30 border-2 border-transparent focus:border-sky-400 rounded-2xl outline-none transition-all text-sky-900 dark:text-sky-50 font-medium placeholder:text-sky-300"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm font-bold text-center bg-red-50 dark:bg-red-900/20 py-2 rounded-xl">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-sky-500/30 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Get Started"}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-sky-400/60 text-sm font-medium">
          Cloud Secure & Encrypted
        </p>
      </motion.div>
    </div>
  );
}
