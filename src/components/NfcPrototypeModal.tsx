"use client";

/*
 * =========================================================================
 * PROTOTYPE ONLY: Simulated NFC Physical Card Tap Flow
 * -------------------------------------------------------------------------
 * This component provides a visual & interactive prototype simulating a
 * physical NFC card tapping against a mobile device to transfer contact data.
 * NOTE: This is strictly a demo/UI prototype and does NOT require or use
 * real NFC hardware or WebNFC APIs.
 * =========================================================================
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, X, CheckCircle2, Smartphone, Download, Sparkles, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";
import { CardPreview, CardData } from "./CardPreview";

interface NfcPrototypeModalProps {
  onClose: () => void;
  demoCard?: CardData;
}

const DEFAULT_NFC_DEMO_CARD: CardData = {
  id: "demo-nfc-card",
  slug: "alex-rivera",
  name: "Alex Rivera",
  photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  country: "United States",
  status: "Professional",
  title: "Head of Product @ TechCorp",
  bio: "Building next-gen digital identity tools. Tapped via physical Cardora NFC prototype card!",
  instagram: "alexrivera.ui",
  linkedin: "alexrivera-product",
  website: "https://alexrivera.design",
  mbti: "ENFP-A",
  interests: "UI/UX, AI Agents, Coffee",
  favoriteSong: "Starboy - The Weeknd",
  favoriteMovie: "Inception",
  theme: "midnight-glass",
  primaryColor: "#a3e635",
};

export function NfcPrototypeModal({ onClose, demoCard = DEFAULT_NFC_DEMO_CARD }: NfcPrototypeModalProps) {
  const [tapState, setTapState] = useState<"idle" | "tapping" | "scanned">("idle");

  const handleSimulateTap = () => {
    setTapState("tapping");
    setTimeout(() => {
      setTapState("scanned");
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#a3e635", "#84cc16", "#ffffff"],
      });
    }, 1500);
  };

  const handleReset = () => {
    setTapState("idle");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-lime-500/10 border border-lime-500/30 text-lime-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-tight font-grotesk">
                NFC Tap Simulation Prototype
              </h3>
              <p className="text-[11px] text-slate-400">
                Interactive demo of physical card-to-phone contact transfer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prototype Explanation Disclaimer */}
        <div className="mb-6 p-3 rounded-xl bg-slate-900/90 border border-lime-500/20 text-xs text-slate-300 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-lime-400">Visual Prototype Notice: </span>
            This UI flow simulates a physical Cardora NFC card tapping a phone. Click the button below to trigger the simulated tap animation!
          </div>
        </div>

        {/* Tap Animation Stage */}
        {tapState !== "scanned" && (
          <div className="flex flex-col items-center justify-center py-8 px-4 border border-dashed border-slate-800 rounded-2xl bg-black/60 relative overflow-hidden">
            {/* Phone & Card Graphic */}
            <div className="relative w-48 h-64 flex items-center justify-center">
              {/* Phone Graphic */}
              <div className="w-36 h-60 rounded-[32px] border-4 border-slate-700 bg-slate-900 flex flex-col items-center justify-between p-3 shadow-2xl relative">
                {/* Speaker notch */}
                <div className="w-12 h-2 rounded-full bg-slate-800" />
                
                {/* Phone screen state */}
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                  <Smartphone className={`w-8 h-8 ${tapState === "tapping" ? "text-lime-400 animate-bounce" : "text-slate-500"}`} />
                  <p className="text-[10px] text-slate-400 font-semibold">
                    {tapState === "tapping" ? "Reading NFC Signal..." : "Ready to Tap"}
                  </p>
                </div>

                <div className="w-8 h-1 rounded-full bg-slate-800" />
              </div>

              {/* Tapping Physical Card Graphic */}
              <motion.div
                animate={
                  tapState === "tapping"
                    ? { y: [-60, -10, -15], rotate: [-10, 5, 0], scale: [0.95, 1.05, 1] }
                    : { y: -70, rotate: -12 }
                }
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute top-4 w-40 h-24 rounded-2xl bg-gradient-to-r from-lime-400 via-lime-500 to-emerald-500 text-black p-3 shadow-2xl flex flex-col justify-between border border-white/40 cursor-pointer"
                onClick={handleSimulateTap}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs font-grotesk">CARDORA NFC</span>
                  <Radio className="w-4 h-4 text-black animate-pulse" />
                </div>
                <div className="text-[10px] font-mono font-bold tracking-widest">
                  TAP PHYSICAL CARD
                </div>
              </motion.div>

              {/* Signal Waves on tap */}
              {tapState === "tapping" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-32 h-32 rounded-full border-2 border-lime-400 animate-ping opacity-75" />
                </div>
              )}
            </div>

            {/* Tap Action CTA */}
            <button
              onClick={handleSimulateTap}
              disabled={tapState === "tapping"}
              className="mt-6 w-full py-3.5 px-6 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-sm shadow-[0_0_20px_rgba(163,230,53,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {tapState === "tapping" ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Simulating NFC Tap...
                </>
              ) : (
                <>
                  <Radio className="w-4 h-4" />
                  Tap Card to Phone (Simulate)
                </>
              )}
            </button>
          </div>
        )}

        {/* Scanned Result State */}
        {tapState === "scanned" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between bg-lime-500/10 border border-lime-500/30 p-3 rounded-2xl text-lime-400 text-xs font-bold">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                NFC Transfer Successful! Card loaded.
              </span>
              <button
                onClick={handleReset}
                className="text-[11px] underline hover:text-white transition-colors"
              >
                Tap Again
              </button>
            </div>

            {/* Display Scanned Card */}
            <CardPreview card={demoCard} isInteractive={true} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
