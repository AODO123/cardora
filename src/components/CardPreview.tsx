"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Instagram,
  Linkedin,
  Globe,
  Share2,
  Download,
  MapPin,
  Sparkles,
  Music,
  Film,
  ExternalLink,
  Radio,
} from "lucide-react";
import { CARD_THEMES, ThemeDefinition } from "@/lib/themes";

export interface CardData {
  id?: string;
  slug?: string;
  name: string;
  photoUrl?: string | null;
  country: string;
  status: string;
  title: string;
  bio: string;
  instagram?: string | null;
  discord?: string | null;
  linkedin?: string | null;
  tiktok?: string | null;
  website?: string | null;
  mbti?: string | null;
  interests?: string | null;
  favoriteSong?: string | null;
  favoriteMovie?: string | null;
  theme?: string;
  primaryColor?: string;
  views?: number;
  linkClicks?: number;
  saves?: number;
}

interface CardPreviewProps {
  card: CardData;
  onSaveContact?: () => void;
  onShare?: () => void;
  onSocialClick?: (platform: string, url: string) => void;
  onTriggerNfcDemo?: () => void;
  isInteractive?: boolean;
}

export function CardPreview({
  card,
  onSaveContact,
  onShare,
  onSocialClick,
  onTriggerNfcDemo,
  isInteractive = true,
}: CardPreviewProps) {
  const [showMoreAbout, setShowMoreAbout] = useState(false);
  const currentTheme: ThemeDefinition =
    CARD_THEMES[card.theme || "sunset-gradient"] || CARD_THEMES["sunset-gradient"];

  const handleLink = (platform: string, rawUrl: string) => {
    if (!isInteractive) return;
    let url = rawUrl;
    if (platform === "instagram" && !rawUrl.startsWith("http")) {
      url = `https://instagram.com/${rawUrl.replace(/^@/, "")}`;
    } else if (platform === "linkedin" && !rawUrl.startsWith("http")) {
      url = `https://linkedin.com/in/${rawUrl.replace(/^@/, "")}`;
    } else if (platform === "tiktok" && !rawUrl.startsWith("http")) {
      url = `https://tiktok.com/@${rawUrl.replace(/^@/, "")}`;
    } else if (platform === "website" && !rawUrl.startsWith("http")) {
      url = `https://${rawUrl}`;
    }

    if (onSocialClick) {
      onSocialClick(platform, url);
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const initialLetter = card.name ? card.name.charAt(0).toUpperCase() : "C";
  const hasMoreAbout = card.mbti || card.interests || card.favoriteSong || card.favoriteMovie;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`w-full max-w-md mx-auto rounded-3xl p-6 sm:p-8 ${currentTheme.cardBg} ${currentTheme.borderStyle} ${currentTheme.textColor} transition-all duration-300 relative overflow-hidden group shadow-2xl`}
    >
      {/* Background ambient glow */}
      <div
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ backgroundColor: currentTheme.accentColor }}
      />
      <div
        className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ backgroundColor: currentTheme.accentColor }}
      />

      {/* Top Banner / Avatar Header */}
      <div className="flex flex-col items-center text-center relative z-10">
        <div className="relative mb-4">
          {card.photoUrl ? (
            <img
              src={card.photoUrl}
              alt={card.name || "Card photo"}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-slate-800/80 shadow-xl"
            />
          ) : (
            <div
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-4xl font-extrabold text-white shadow-xl border-4 border-slate-800/80 bg-gradient-to-tr from-purple-600 via-rose-500 to-orange-500"
            >
              {initialLetter}
            </div>
          )}
          <span
            className={`absolute bottom-1 right-1 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${currentTheme.badgeBg} ${currentTheme.badgeText}`}
          >
            {card.status || "Pro"}
          </span>
        </div>

        {/* Name & Title */}
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-grotesk leading-snug">
          {card.name || "Your Name"}
        </h2>
        <p className={`text-sm sm:text-base font-medium mt-1 ${currentTheme.secondaryTextColor}`}>
          {card.title || "Your Title or Job"}
        </p>

        {/* Location / Country */}
        <div className="flex items-center gap-1.5 mt-2 text-xs sm:text-sm text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-rose-400" />
          <span>{card.country || "Global"}</span>
        </div>

        {/* Bio */}
        {card.bio && (
          <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm px-2">
            "{card.bio}"
          </p>
        )}
      </div>

      {/* Social & Personal Links */}
      <div className="mt-6 space-y-2.5 relative z-10">
        {card.website && (
          <button
            onClick={() => handleLink("website", card.website!)}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 flex items-center justify-between text-xs sm:text-sm font-medium transition-all group/btn"
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-rose-400" />
              <span className="truncate max-w-[200px] sm:max-w-[240px]">
                {card.website.replace(/^https?:\/\//, "")}
              </span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-white transition-colors" />
          </button>
        )}

        {/* Social Grid */}
        <div className="grid grid-cols-2 gap-2">
          {card.instagram && (
            <button
              onClick={() => handleLink("instagram", card.instagram!)}
              className="py-2.5 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center gap-2 text-xs font-medium transition-all"
            >
              <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
              <span className="truncate">@{card.instagram.replace(/^@/, "")}</span>
            </button>
          )}

          {card.linkedin && (
            <button
              onClick={() => handleLink("linkedin", card.linkedin!)}
              className="py-2.5 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center gap-2 text-xs font-medium transition-all"
            >
              <Linkedin className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="truncate">{card.linkedin.replace(/^@/, "")}</span>
            </button>
          )}

          {card.tiktok && (
            <button
              onClick={() => handleLink("tiktok", card.tiktok!)}
              className="py-2.5 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center gap-2 text-xs font-medium transition-all"
            >
              <span className="font-bold text-xs text-orange-400 shrink-0">TT</span>
              <span className="truncate">@{card.tiktok.replace(/^@/, "")}</span>
            </button>
          )}

          {card.discord && (
            <button
              onClick={() => alert(`Discord: ${card.discord}`)}
              className="py-2.5 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center gap-2 text-xs font-medium transition-all"
            >
              <span className="font-bold text-xs text-indigo-400 shrink-0">DC</span>
              <span className="truncate">{card.discord}</span>
            </button>
          )}
        </div>
      </div>

      {/* Optional "More About Me" Accordion */}
      {hasMoreAbout && (
        <div className="mt-5 border-t border-slate-800/80 pt-4 relative z-10">
          <button
            onClick={() => setShowMoreAbout(!showMoreAbout)}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              More About Me
            </span>
            <span>{showMoreAbout ? "▲" : "▼"}</span>
          </button>

          {showMoreAbout && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 space-y-2 text-xs text-slate-300 bg-slate-900/50 p-3 rounded-xl border border-slate-800"
            >
              {card.mbti && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">MBTI Type:</span>
                  <span className="font-bold text-rose-400">{card.mbti}</span>
                </div>
              )}
              {card.interests && (
                <div className="flex flex-col gap-1">
                  <span className="text-slate-400">Interests:</span>
                  <span className="text-white font-medium">{card.interests}</span>
                </div>
              )}
              {card.favoriteSong && (
                <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                  <Music className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  <span className="truncate text-slate-200">{card.favoriteSong}</span>
                </div>
              )}
              {card.favoriteMovie && (
                <div className="flex items-center gap-2">
                  <Film className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span className="truncate text-slate-200">{card.favoriteMovie}</span>
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}

      {/* Action Buttons: Save Contact & Share */}
      <div className="mt-6 grid grid-cols-2 gap-3 relative z-10">
        <button
          onClick={onSaveContact}
          className={`py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold shadow-lg transition-transform active:scale-95 ${currentTheme.buttonBg} ${currentTheme.buttonText}`}
        >
          <Download className="w-4 h-4" />
          Save Contact
        </button>

        <button
          onClick={onShare}
          className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center justify-center gap-2 text-xs sm:text-sm border border-slate-700 transition-all active:scale-95"
        >
          <Share2 className="w-4 h-4 text-rose-400" />
          Share / QR
        </button>
      </div>

      {/* NFC Tap Simulation trigger bar */}
      {onTriggerNfcDemo && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 text-center relative z-10">
          <button
            onClick={onTriggerNfcDemo}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-400 hover:text-rose-300 transition-colors"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Simulate NFC Physical Card Tap
          </button>
        </div>
      )}
    </motion.div>
  );
}
