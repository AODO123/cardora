"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  QrCode,
  Download,
  Share2,
  TrendingUp,
  Radio,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Globe,
  Layers,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CardPreview, CardData } from "@/components/CardPreview";
import { NfcPrototypeModal } from "@/components/NfcPrototypeModal";

const HERO_DEMO_CARDS: CardData[] = [
  {
    name: "Elena Rostova",
    title: "Senior Product Designer",
    status: "Professional",
    country: "Germany",
    bio: "Crafting digital experiences & system design architecture. Tapped via Cardora NFC.",
    instagram: "elena.design",
    linkedin: "elena-rostova",
    website: "https://elena.design",
    theme: "lime-grotesk",
    primaryColor: "#a3e635",
  },
  {
    name: "Marcus Chen",
    title: "AI Engineer & Founder",
    status: "Professional",
    country: "Singapore",
    bio: "Building autonomous developer agents and LLM tools. Always open for coffee.",
    linkedin: "marcuschen-ai",
    discord: "marcus_ai#1001",
    website: "https://chen.ai",
    theme: "midnight-glass",
    primaryColor: "#a3e635",
  },
  {
    name: "Maya Lin",
    title: "CS Student @ Stanford",
    status: "Student",
    country: "United States",
    bio: "Junior studying Computer Science & HCI. Passionate about mobile interfaces.",
    tiktok: "mayacodes",
    instagram: "maya.cs",
    theme: "ocean-cyan",
    primaryColor: "#22d3ee",
  },
];

export default function LandingPage() {
  const [showNfcModal, setShowNfcModal] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-lime-400 selection:text-black">
      <Navbar />

      {/* HERO SECTION — Dark, oversized grotesk headline, fanned animated cards */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden bg-gradient-to-b from-black via-slate-950 to-zinc-900 border-b border-slate-800/80">
        {/* Glow ambient spots */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-400/10 border border-lime-400/30 text-lime-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Next-Gen Digital Business Cards</span>
              </div>

              {/* Bold Grotesk Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-grotesk tracking-tight leading-[1.08] text-white">
                YOUR IDENTITY. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-lime-300 to-emerald-400">
                  YOUR CARD.
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Replace outdated physical paper cards. Create a shareable digital identity card once, get a custom link + dynamic QR code, and update details anytime.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/editor"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-lime-400 hover:bg-lime-300 text-black font-black text-sm sm:text-base shadow-[0_0_30px_rgba(163,230,53,0.35)] transition-all active:scale-95 flex items-center justify-center gap-2 font-grotesk"
                >
                  Create Your Free Card
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <button
                  onClick={() => setShowNfcModal(true)}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all active:scale-95"
                >
                  <Radio className="w-4 h-4 text-lime-400 animate-pulse" />
                  Try NFC Tap Demo
                </button>
              </div>

              {/* Social Proof */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-lime-400" /> Free 1 Card Forever
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-lime-400" /> vCard Export Included
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-lime-400" /> Instant QR Code
                </span>
              </div>
            </div>

            {/* Hero Right — Fanned 2-3 Digital Cards with Floating Idle Animation */}
            <div className="lg:col-span-5 relative flex items-center justify-center py-8">
              <div className="relative w-full max-w-sm sm:max-w-md h-[460px] flex items-center justify-center">
                
                {/* Background Card 3 (Maya Lin) - Parallax Tilt Left */}
                <motion.div
                  animate={{
                    y: [-8, 8, -8],
                    rotate: [-8, -4, -8],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-4 left-0 w-72 sm:w-80 pointer-events-none scale-90 opacity-60 filter blur-[0.5px]"
                >
                  <CardPreview card={HERO_DEMO_CARDS[2]} isInteractive={false} />
                </motion.div>

                {/* Background Card 2 (Marcus Chen) - Parallax Tilt Right */}
                <motion.div
                  animate={{
                    y: [8, -8, 8],
                    rotate: [8, 4, 8],
                  }}
                  transition={{
                    duration: 6.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="absolute top-2 right-0 w-72 sm:w-80 pointer-events-none scale-95 opacity-80"
                >
                  <CardPreview card={HERO_DEMO_CARDS[1]} isInteractive={false} />
                </motion.div>

                {/* Foreground Primary Card 1 (Elena Rostova) - Gentle Idle Float */}
                <motion.div
                  animate={{
                    y: [-6, 6, -6],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative z-20 w-80 sm:w-88 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                >
                  <CardPreview card={HERO_DEMO_CARDS[0]} isInteractive={false} />
                </motion.div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TRANSITION: Transition from Dark Hero to Light Body Section */}
      <section className="bg-slate-100 text-slate-900 py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="px-3.5 py-1 rounded-full bg-lime-400 text-black font-extrabold text-xs uppercase tracking-wider font-grotesk">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-grotesk tracking-tight">
              Everything You Need to Share Your Identity
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Designed for professionals, students, freelancers, and teams. Built for instant contact saving and real-time analytics.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: Live Preview & Themes */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-4 hover:shadow-2xl transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-black text-lime-400 flex items-center justify-center font-bold">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-grotesk text-slate-900">Live Editor & Premium Themes</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Customize colors, photo, bio, MBTI, social handles, and theme styles with a real-time side-by-side interactive preview.
              </p>
            </div>

            {/* Feature 2: Auto QR & Share Link */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-4 hover:shadow-2xl transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-black text-lime-400 flex items-center justify-center font-bold">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-grotesk text-slate-900">Dynamic QR & vCard Export</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Auto-generates a shareable URL (`cardora.io/c/username`) and high-res QR code. Anyone can save your contact with 1-click vCard download.
              </p>
            </div>

            {/* Feature 3: Real-Time Analytics */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-4 hover:shadow-2xl transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-black text-lime-400 flex items-center justify-center font-bold">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-grotesk text-slate-900">Engagement Analytics</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Track card views, link click-throughs, and contact saves in real-time on your private user dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION — Free ($0) vs Pro ($5/mo) */}
      <section className="bg-black text-white py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl sm:text-5xl font-black font-grotesk tracking-tight">
              Simple, Honest Pricing
            </h2>
            <p className="text-slate-400 text-base">
              Start free with 1 card per account, or upgrade to Pro for unlimited cards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Free Tier */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Free Tier</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black font-grotesk text-white">$0</span>
                  <span className="text-slate-400 text-sm">/ forever</span>
                </div>
                <p className="text-slate-400 text-xs mt-2">Perfect for personal digital identity cards.</p>

                <ul className="mt-6 space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                    <span>1 Digital Card per Account</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                    <span>Custom Shareable Link & QR Code</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                    <span>vCard Contact Download (.vcf)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                    <span>Basic View Counter</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/editor"
                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-center text-sm transition-all"
              >
                Get Started Free
              </Link>
            </div>

            {/* Paid Tier: $5/mo */}
            <div className="bg-gradient-to-b from-slate-900 via-zinc-900 to-black border-2 border-lime-400 rounded-3xl p-8 flex flex-col justify-between space-y-6 relative shadow-[0_0_35px_rgba(163,230,53,0.2)]">
              <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-lime-400 text-black font-extrabold text-[10px] uppercase tracking-wider font-grotesk">
                Most Popular
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-lime-400 mb-2">Pro Tier</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black font-grotesk text-white">$5</span>
                  <span className="text-slate-400 text-sm">/ month</span>
                </div>
                <p className="text-slate-400 text-xs mt-2">For creators, executives, & power networkers.</p>

                <ul className="mt-6 space-y-3 text-sm text-slate-200">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                    <span className="font-bold text-white">Unlimited Digital Cards</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                    <span>All 5 Premium Themes & Custom Colors</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                    <span>Advanced Analytics (Clicks & Saves)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                    <span>NFC Tap Simulation Prototype Feature</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/editor"
                className="w-full py-3.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-black text-center text-sm shadow-lg transition-all"
              >
                Upgrade to Pro ($5/mo)
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer onOpenNfcDemo={() => setShowNfcModal(true)} />

      {/* NFC Prototype Modal */}
      {showNfcModal && <NfcPrototypeModal onClose={() => setShowNfcModal(false)} />}
    </div>
  );
}
