"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          router.push("/");
          router.refresh();
        } else {
          setIsLogin(true);
          setError("Account created successfully. Please login.");
        }
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-100 via-white to-cyan-100 dark:from-slate-950 dark:via-sky-950 dark:to-black flex items-center justify-center px-4 py-10">
      {/* Background Blobs */}
      <div className="absolute top-[-120px] left-[-120px] h-[300px] w-[300px] rounded-full bg-sky-400/30 blur-3xl" />
      <div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-cyan-400/20 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-center"
        >
          <div className="flex items-center gap-2 rounded-full border border-sky-200 dark:border-sky-800 bg-white/70 dark:bg-slate-900/60 px-4 py-2 backdrop-blur-xl shadow-lg">
            <Sparkles className="text-sky-500" size={16} />
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-sky-700 dark:text-sky-200">
              Smart Expense Tracker
            </p>
          </div>
        </motion.div>

        {/* Main Card */}
        <div className="rounded-[2.5rem] border border-white/40 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl p-8 shadow-[0_20px_80px_rgba(14,165,233,0.15)]">
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 4 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-2xl shadow-sky-500/40"
            >
              <Wallet size={42} />
            </motion.div>

            <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Expensy
            </h1>

            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.35em] text-sky-500 dark:text-sky-300">
              Finance Made Beautiful
            </p>
          </div>

          {/* Toggle */}
          <div className="mb-8 grid grid-cols-2 rounded-2xl bg-sky-50 dark:bg-slate-950/50 p-1.5">
            <button
              onClick={() => setIsLogin(true)}
              className={`rounded-2xl py-3 text-sm font-black uppercase tracking-widest transition-all duration-300 ${
                isLogin
                  ? "bg-white dark:bg-slate-800 text-sky-600 shadow-lg"
                  : "text-sky-400"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setIsLogin(false)}
              className={`rounded-2xl py-3 text-sm font-black uppercase tracking-widest transition-all duration-300 ${
                !isLogin
                  ? "bg-white dark:bg-slate-800 text-sky-600 shadow-lg"
                  : "text-sky-400"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative overflow-hidden"
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
                    className="w-full rounded-2xl border border-sky-100 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 py-4 pl-12 pr-4 text-slate-800 dark:text-white outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
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
                className="w-full rounded-2xl border border-sky-100 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 py-4 pl-12 pr-4 text-slate-800 dark:text-white outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20"
              />
            </div>

            {/* Password */}
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
                className="w-full rounded-2xl border border-sky-100 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 py-4 pl-12 pr-4 text-slate-800 dark:text-white outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20"
              />
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-500 dark:border-red-900 dark:bg-red-950/20"
              >
                {error}
              </motion.div>
            )}

            {/* Button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 py-5 text-sm font-black uppercase tracking-[0.25em] text-white shadow-2xl shadow-sky-500/30 transition-all disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </form>

          {/* Bottom */}
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-sky-500 dark:text-sky-300">
            <ShieldCheck size={18} />
            <span className="font-medium">End-to-End Encrypted & Secure</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
