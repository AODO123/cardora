export interface ThemeDefinition {
  id: string;
  name: string;
  cardBg: string;
  borderStyle: string;
  accentColor: string;
  textColor: string;
  secondaryTextColor: string;
  badgeBg: string;
  badgeText: string;
  buttonBg: string;
  buttonText: string;
  meshGradientBg: string;
}

export const CARD_THEMES: Record<string, ThemeDefinition> = {
  "sunset-gradient": {
    id: "sunset-gradient",
    name: "Cardora Sunset",
    cardBg: "bg-gradient-to-br from-purple-950/90 via-slate-900/90 to-rose-950/90 backdrop-blur-xl",
    borderStyle: "border border-rose-500/40 shadow-[0_0_30px_rgba(244,63,94,0.25)]",
    accentColor: "#f43f5e",
    textColor: "text-white",
    secondaryTextColor: "text-rose-200/70",
    badgeBg: "bg-gradient-to-r from-purple-500/20 to-rose-500/20 border border-rose-500/40",
    badgeText: "text-rose-300",
    buttonBg: "bg-gradient-to-r from-purple-500 via-rose-500 to-orange-500 hover:opacity-90 shadow-lg",
    buttonText: "text-white font-bold",
    meshGradientBg: "from-purple-950 via-slate-950 to-rose-950",
  },
  "violet-glow": {
    id: "violet-glow",
    name: "Violet Glow",
    cardBg: "bg-slate-950/90 backdrop-blur-2xl",
    borderStyle: "border border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.3)]",
    accentColor: "#a855f7",
    textColor: "text-white",
    secondaryTextColor: "text-purple-300/70",
    badgeBg: "bg-purple-500/20 border border-purple-400/40",
    badgeText: "text-purple-300",
    buttonBg: "bg-purple-500 hover:bg-purple-600",
    buttonText: "text-white font-bold",
    meshGradientBg: "from-black via-purple-950/60 to-black",
  },
  "coral-fusion": {
    id: "coral-fusion",
    name: "Coral Fusion",
    cardBg: "bg-zinc-950/95",
    borderStyle: "border-2 border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.3)]",
    accentColor: "#f97316",
    textColor: "text-white",
    secondaryTextColor: "text-orange-200/70",
    badgeBg: "bg-gradient-to-r from-rose-500 to-orange-500",
    badgeText: "text-white font-bold",
    buttonBg: "bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600",
    buttonText: "text-white font-extrabold",
    meshGradientBg: "from-black via-zinc-900 to-rose-950/40",
  },
  "ocean-cyan": {
    id: "ocean-cyan",
    name: "Ocean Cyan",
    cardBg: "bg-gradient-to-br from-slate-950/90 via-cyan-950/80 to-blue-950/90 backdrop-blur-xl",
    borderStyle: "border border-cyan-400/30 shadow-[0_0_30px_rgba(34,211,238,0.2)]",
    accentColor: "#22d3ee",
    textColor: "text-white",
    secondaryTextColor: "text-cyan-200/70",
    badgeBg: "bg-cyan-500/20 border border-cyan-400/30",
    badgeText: "text-cyan-300",
    buttonBg: "bg-cyan-400 hover:bg-cyan-500",
    buttonText: "text-slate-950 font-bold",
    meshGradientBg: "from-slate-950 via-cyan-950 to-blue-950",
  },
  "midnight-glass": {
    id: "midnight-glass",
    name: "Midnight Glass",
    cardBg: "bg-slate-950/80 backdrop-blur-xl",
    borderStyle: "border border-rose-500/30 shadow-[0_0_25px_rgba(244,63,94,0.15)]",
    accentColor: "#f43f5e",
    textColor: "text-white",
    secondaryTextColor: "text-slate-400",
    badgeBg: "bg-rose-500/10 border border-rose-500/30",
    badgeText: "text-rose-400",
    buttonBg: "bg-rose-500 hover:bg-rose-600",
    buttonText: "text-white font-semibold",
    meshGradientBg: "from-slate-900 via-zinc-950 to-black",
  },
};
