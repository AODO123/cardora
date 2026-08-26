"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CreditCard, Shield, User, Sparkles, LogOut, PlusCircle } from "lucide-react";
import { AuthModal } from "./AuthModal";
import { CardoraLogo } from "./CardoraLogo";

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
      <header className="sticky top-0 z-50 bg-black/85 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo with uploaded graphic icon */}
          <Link href="/" className="flex items-center gap-2">
            <CardoraLogo size={36} showText={true} />
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link href="/" className="hover:text-rose-400 transition-colors">
              Home
            </Link>
            <Link href="/editor" className="hover:text-rose-400 transition-colors flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-rose-400" />
              Create Card
            </Link>
            <Link href="/dashboard" className="hover:text-rose-400 transition-colors">
              Dashboard
            </Link>
            <Link href="/admin" className="hover:text-rose-400 transition-colors flex items-center gap-1 text-slate-400">
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
                  <User className="w-3.5 h-3.5 text-rose-400" />
                  <span>{user.name}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold ${user.plan === 'PAID' ? 'bg-gradient-to-r from-purple-500 via-rose-500 to-orange-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {user.plan}
                  </span>
                </Link>
                <Link
                  href="/settings"
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Settings"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
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
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 via-rose-500 to-orange-500 hover:opacity-90 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(244,63,94,0.35)] transition-all active:scale-95"
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
