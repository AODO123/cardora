"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/router";
import { CreditCard, Shield, User, Sparkles, LogOut, PlusCircle } from "lucide-react";
import { AuthModal } from "./AuthModal";

export function Navbar() {
  const [user, setUser] = useState<{ name: string; email: string; plan: string; role: string } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-lime-400 flex items-center justify-center text-black font-black text-xl shadow-[0_0_15px_rgba(163,230,53,0.4)] group-hover:scale-105 transition-transform">
              C
            </div>
            <span className="text-xl font-black tracking-tight text-white font-grotesk">
              CARD<span className="text-lime-400">ORA</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link href="/" className="hover:text-lime-400 transition-colors">
              Home
            </Link>
            <Link href="/editor" className="hover:text-lime-400 transition-colors flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-lime-400" />
              Create Card
            </Link>
            <Link href="/dashboard" className="hover:text-lime-400 transition-colors">
              Dashboard
            </Link>
            <Link href="/admin" className="hover:text-lime-400 transition-colors flex items-center gap-1 text-slate-400">
              <Shield className="w-3.5 h-3.5" />
              Admin
            </Link>
          </nav>

          {/* User Auth state */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-white hover:border-slate-700 transition-all"
                >
                  <User className="w-3.5 h-3.5 text-lime-400" />
                  <span>{user.name}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold ${user.plan === 'PAID' ? 'bg-lime-400 text-black' : 'bg-slate-800 text-slate-400'}`}>
                    {user.plan}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setShowAuthModal(true);
                  }}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setAuthMode("signup");
                    setShowAuthModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(163,230,53,0.3)] transition-all active:scale-95"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            fetchUser();
          }}
        />
      )}
    </>
  );
}
