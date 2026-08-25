"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Lock, Mail, User, AlertCircle, ArrowRight } from "lucide-react";

interface AuthModalProps {
  mode?: "login" | "signup";
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ mode: initialMode = "login", onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
    const body = mode === "login" ? { email, password } : { name, email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-lime-400 text-black flex items-center justify-center text-2xl font-black mx-auto mb-3 shadow-[0_0_20px_rgba(163,230,53,0.4)]">
            C
          </div>
          <h3 className="text-2xl font-extrabold font-grotesk tracking-tight">
            {mode === "login" ? "Welcome Back to Cardora" : "Create Your Account"}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode === "login" ? "Sign in to manage your digital cards" : "Free 1 card forever. Upgrade anytime."}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-slate-900 border border-slate-800 focus:border-lime-400 focus:outline-none text-xs text-white placeholder-slate-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-slate-900 border border-slate-800 focus:border-lime-400 focus:outline-none text-xs text-white placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-slate-900 border border-slate-800 focus:border-lime-400 focus:outline-none text-xs text-white placeholder-slate-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-xs sm:text-sm shadow-[0_0_20px_rgba(163,230,53,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? "Processing..." : mode === "login" ? "Sign In" : "Create Account"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Mode Footer */}
        <div className="mt-6 text-center text-xs text-slate-400">
          {mode === "login" ? (
            <p>
              Don't have an account?{" "}
              <button
                onClick={() => {
                  setMode("signup");
                  setError("");
                }}
                className="text-lime-400 font-bold hover:underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already registered?{" "}
              <button
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className="text-lime-400 font-bold hover:underline"
              >
                Log In
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
