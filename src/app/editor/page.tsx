"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CardPreview, CardData } from "@/components/CardPreview";
import { CARD_THEMES } from "@/lib/themes";
import {
  User,
  Share2,
  Sparkles,
  Palette,
  CheckCircle2,
  AlertCircle,
  Save,
  Globe,
  Instagram,
  Linkedin,
  Radio,
  ArrowLeft,
  Lock,
} from "lucide-react";

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [activeTab, setActiveTab] = useState<"basic" | "social" | "more" | "theme">("basic");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [limitReached, setLimitReached] = useState(false);

  // Form State initialized with defaults
  const [formData, setFormData] = useState<CardData>({
    name: "Alex Rivera",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    country: "United States",
    status: "Professional",
    title: "Senior Product Designer",
    bio: "Building next-gen digital identity experiences. Lover of clean UI & coffee.",
    instagram: "alexrivera.ui",
    discord: "alexrivera#1001",
    linkedin: "alexrivera-product",
    tiktok: "alexriveracodes",
    website: "https://alexrivera.design",
    mbti: "INTJ-A",
    interests: "UI/UX, System Architecture, Coffee",
    favoriteSong: "Starboy - The Weeknd",
    favoriteMovie: "Interstellar",
    theme: "midnight-glass",
    primaryColor: "#a3e635",
  });

  useEffect(() => {
    fetchUserAndCard();
  }, [editId]);

  const fetchUserAndCard = async () => {
    try {
      const meRes = await fetch("/api/auth/me");
      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentUser(meData.user);
      }

      if (editId) {
        const cardRes = await fetch(`/api/cards/${editId}`);
        if (cardRes.ok) {
          const cardData = await cardRes.json();
          setFormData(cardData.card);
        }
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };

  const handleChange = (field: keyof CardData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);
    setLimitReached(false);

    try {
      const method = editId ? "PUT" : "POST";
      const url = editId ? `/api/cards/${editId}` : "/api/cards";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.limitReached) {
          setLimitReached(true);
        }
        throw new Error(data.error || "Failed to save card.");
      }

      setSuccessMsg(`Card saved successfully! Share URL: /c/${data.card.slug}`);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to save card.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeDemo = async () => {
    try {
      const res = await fetch("/api/user/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "PAID" }),
      });
      if (res.ok) {
        setCurrentUser((prev: any) => ({ ...prev, plan: "PAID" }));
        setLimitReached(false);
        setError("");
        setSuccessMsg("Upgraded to Pro Tier ($5/mo simulated)! You can now create unlimited cards.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black font-grotesk tracking-tight">
            {editId ? "Edit Digital Card" : "Create Digital Business Card"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Customize your profile info, social links, and theme with live instant preview
          </p>
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </button>
      </div>

      {/* Free Tier Limit Reached Banner */}
      {limitReached && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold">Free Plan Limit Reached: </span>
              Free accounts are limited to 1 card. Upgrade to Pro ($5/mo) for unlimited cards.
            </div>
          </div>
          <button
            onClick={handleUpgradeDemo}
            className="px-4 py-2 rounded-xl bg-lime-400 text-black font-extrabold text-xs shrink-0 shadow-md hover:bg-lime-300 transition-all"
          >
            Simulate Instant Upgrade ($5/mo)
          </button>
        </div>
      )}

      {/* Success / Error Alerts */}
      {error && !limitReached && (
        <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-3 rounded-xl bg-lime-500/10 border border-lime-500/30 text-lime-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Dual Pane Layout: Form Controls Left | Live Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: Tabbed Form Controls */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          
          {/* Form Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
            <button
              type="button"
              onClick={() => setActiveTab("basic")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "basic"
                  ? "bg-lime-400 text-black shadow-md"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              1. Basic Profile
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("social")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "social"
                  ? "bg-lime-400 text-black shadow-md"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              2. Social Handles
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("more")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "more"
                  ? "bg-lime-400 text-black shadow-md"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              3. More About Me
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("theme")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "theme"
                  ? "bg-lime-400 text-black shadow-md"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              4. Theme & Styling
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            
            {/* TAB 1: BASIC PROFILE */}
            {activeTab === "basic" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Rivera"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-lime-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Job Title / Grade</label>
                    <input
                      type="text"
                      required
                      placeholder="Senior Designer or CS Student"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-lime-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleChange("status", e.target.value)}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-lime-400 focus:outline-none"
                    >
                      <option value="Professional">Professional</option>
                      <option value="Student">Student</option>
                      <option value="Freelancer">Freelancer</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Country</label>
                    <input
                      type="text"
                      placeholder="United States"
                      value={formData.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-lime-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Photo URL</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.photoUrl || ""}
                      onChange={(e) => handleChange("photoUrl", e.target.value)}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-lime-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">About Me (Bio)</label>
                  <textarea
                    rows={3}
                    placeholder="Brief bio describing what you do..."
                    value={formData.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-lime-400 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: SOCIAL HANDLES */}
            {activeTab === "social" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Personal Website</label>
                  <input
                    type="text"
                    placeholder="https://yourwebsite.com"
                    value={formData.website || ""}
                    onChange={(e) => handleChange("website", e.target.value)}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-lime-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Instagram Handle</label>
                    <input
                      type="text"
                      placeholder="@username"
                      value={formData.instagram || ""}
                      onChange={(e) => handleChange("instagram", e.target.value)}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-lime-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn Profile/Handle</label>
                    <input
                      type="text"
                      placeholder="john-doe"
                      value={formData.linkedin || ""}
                      onChange={(e) => handleChange("linkedin", e.target.value)}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-lime-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">TikTok Handle</label>
                    <input
                      type="text"
                      placeholder="@username"
                      value={formData.tiktok || ""}
                      onChange={(e) => handleChange("tiktok", e.target.value)}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-lime-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Discord Tag</label>
                    <input
                      type="text"
                      placeholder="user#1234"
                      value={formData.discord || ""}
                      onChange={(e) => handleChange("discord", e.target.value)}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-lime-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: MORE ABOUT ME */}
            {activeTab === "more" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">MBTI Personality Type</label>
                    <input
                      type="text"
                      placeholder="INTJ-A, ENFP, etc."
                      value={formData.mbti || ""}
                      onChange={(e) => handleChange("mbti", e.target.value)}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-lime-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Interests</label>
                    <input
                      type="text"
                      placeholder="UI/UX, AI, Coffee, Gaming"
                      value={formData.interests || ""}
                      onChange={(e) => handleChange("interests", e.target.value)}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-lime-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Favorite Song</label>
                    <input
                      type="text"
                      placeholder="Starboy - The Weeknd"
                      value={formData.favoriteSong || ""}
                      onChange={(e) => handleChange("favoriteSong", e.target.value)}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-lime-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Favorite Movie</label>
                    <input
                      type="text"
                      placeholder="Inception, Interstellar"
                      value={formData.favoriteMovie || ""}
                      onChange={(e) => handleChange("favoriteMovie", e.target.value)}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-lime-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: THEME & STYLING */}
            {activeTab === "theme" && (
              <div className="space-y-4">
                <label className="block text-xs font-semibold text-slate-300 mb-2">Select Theme Template</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.values(CARD_THEMES).map((th) => (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => handleChange("theme", th.id)}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        formData.theme === th.id
                          ? "border-lime-400 bg-lime-500/10 shadow-[0_0_15px_rgba(163,230,53,0.2)]"
                          : "border-slate-800 bg-slate-900 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white font-grotesk">{th.name}</span>
                        {formData.theme === th.id && (
                          <CheckCircle2 className="w-4 h-4 text-lime-400" />
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: th.accentColor }} />
                        <span className="text-[10px] text-slate-400 capitalize">{th.id.replace("-", " ")}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Save CTA */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-xs sm:text-sm shadow-[0_0_20px_rgba(163,230,53,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2 font-grotesk"
              >
                <Save className="w-4 h-4" />
                {loading ? "Saving Card..." : editId ? "Update Card" : "Save & Create Card"}
              </button>
            </div>
          </form>

        </div>

        {/* RIGHT: Live Real-Time Interactive Card Preview */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-grotesk">
              <Sparkles className="w-3.5 h-3.5 text-lime-400 animate-pulse" />
              Live Instant Preview
            </span>
            <span className="text-[11px] text-slate-500">Updates dynamically as you edit</span>
          </div>

          {/* Render Card Preview */}
          <div className="p-2 rounded-3xl bg-slate-950 border border-slate-800/80 shadow-2xl flex items-center justify-center">
            <CardPreview card={formData} isInteractive={true} />
          </div>
        </div>

      </div>
    </main>
  );
}

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-lime-400 selection:text-black">
      <Navbar />
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-lime-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <EditorContent />
      </Suspense>
      <Footer />
    </div>
  );
}
