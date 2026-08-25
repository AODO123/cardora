"use client";

import React from "react";
import Link from "next/link";
import { Radio, Shield } from "lucide-react";
import { CardoraLogo } from "./CardoraLogo";

interface FooterProps {
  onOpenNfcDemo?: () => void;
}

export function Footer({ onOpenNfcDemo }: FooterProps) {
  return (
    <footer className="bg-black border-t border-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand with logo */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <CardoraLogo size={32} showText={true} />
          <p className="text-xs text-slate-500 max-w-sm text-center md:text-left">
            Your identity, your card. Replace physical cards with shareable digital identity cards.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-400">
          <Link href="/" className="hover:text-rose-400 transition-colors">
            Home
          </Link>
          <Link href="/editor" className="hover:text-rose-400 transition-colors">
            Create Card
          </Link>
          <Link href="/dashboard" className="hover:text-rose-400 transition-colors">
            Dashboard
          </Link>
          <Link href="/admin" className="hover:text-rose-400 transition-colors flex items-center gap-1">
            <Shield className="w-3 h-3 text-slate-500" />
            Admin
          </Link>
          {onOpenNfcDemo && (
            <button
              onClick={onOpenNfcDemo}
              className="text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
            >
              <Radio className="w-3 h-3 animate-pulse" />
              NFC Tap Demo
            </button>
          )}
        </div>

        {/* Copyright */}
        <div className="text-xs text-slate-600 text-center md:text-right">
          © {new Date().getFullYear()} Cardora Inc. Built for production excellence.
        </div>
      </div>
    </footer>
  );
}
