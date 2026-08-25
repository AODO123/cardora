"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnalyticsChart } from "@/components/AnalyticsChart";
import { QrCodeModal } from "@/components/QrCodeModal";
import { AuthModal } from "@/components/AuthModal";
import {
  PlusCircle,
  ExternalLink,
  Edit,
  Trash2,
  QrCode,
  Copy,
  Check,
  CreditCard,
  Lock,
} from "lucide-react";
import { CardData } from "@/components/CardPreview";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedQrCard, setSelectedQrCard] = useState<CardData | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) {
        setLoading(false);
        setShowAuthModal(true);
        return;
      }
      const meData = await meRes.json();
      setUser(meData.user);

      const cardsRes = await fetch("/api/cards");
      if (cardsRes.ok) {
        const cardsData = await cardsRes.json();
        setCards(cardsData.cards);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (!confirm("Are you sure you want to delete this digital business card?")) return;

    try {
      const res = await fetch(`/api/cards/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCards((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (e) {
      console.error("Failed to delete card", e);
    }
  };

  const handleCopyLink = (slug: string, id: string) => {
    const fullUrl = `${window.location.origin}/c/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTogglePlan = async () => {
    if (!user) return;
    const targetPlan = user.plan === "FREE" ? "PAID" : "FREE";
    try {
      const res = await fetch("/api/user/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: targetPlan }),
      });
      if (res.ok) {
        setUser((prev: any) => ({ ...prev, plan: targetPlan }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const totalViews = cards.reduce((acc, c) => acc + (c.views || 0), 0);
  const totalClicks = cards.reduce((acc, c) => acc + (c.linkClicks || 0), 0);
  const totalSaves = cards.reduce((acc, c) => acc + (c.saves || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-between">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-12 h-12 rounded-full border-4 border-rose-500 border-t-transparent animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-between">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center space-y-4 max-w-md mx-auto">
          <Lock className="w-12 h-12 text-rose-400" />
          <h2 className="text-3xl font-black font-grotesk">Login Required</h2>
          <p className="text-xs text-slate-400">
            Please log in or sign up to access your digital business cards and analytics.
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-rose-500 to-orange-500 text-white font-extrabold text-xs shadow-lg hover:opacity-90 transition-all"
          >
            Log In / Sign Up
          </button>
        </div>
        <Footer />

        {showAuthModal && (
          <AuthModal
            mode="login"
            onClose={() => setShowAuthModal(false)}
            onSuccess={() => {
              setShowAuthModal(false);
              fetchDashboardData();
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header & Plan Status Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black font-grotesk tracking-tight">
              Welcome, {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage your digital business cards and track real-time audience engagement.
            </p>
          </div>

          {/* Plan Upgrade / Status Pill */}
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-2.5 rounded-2xl">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Current Plan</div>
              <div className="text-xs font-black text-rose-400 font-grotesk">
                {user.plan === "PAID" ? "PRO UNLIMITED ($5/mo)" : "FREE TIER (1 Card)"}
              </div>
            </div>
            <button
              onClick={handleTogglePlan}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 via-rose-500 to-orange-500 hover:opacity-90 text-white font-bold text-xs shadow-md transition-all"
            >
              {user.plan === "PAID" ? "Switch to Free" : "Upgrade to Pro ($5/mo)"}
            </button>
          </div>
        </div>

        {/* Analytics Summary */}
        <AnalyticsChart
          totalViews={totalViews}
          totalLinkClicks={totalClicks}
          totalSaves={totalSaves}
        />

        {/* Cards Management Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black font-grotesk tracking-tight">
              Your Digital Cards ({cards.length})
            </h2>

            <Link
              href="/editor"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-rose-500 to-orange-500 hover:opacity-90 text-white font-extrabold text-xs shadow-[0_0_20px_rgba(244,63,94,0.35)] transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              Create New Card
            </Link>
          </div>

          {cards.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-950 border border-dashed border-slate-800 text-center space-y-4">
              <CreditCard className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold">No digital cards created yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Create your first digital business card with custom social handles, vCard download, and dynamic QR code.
              </p>
              <Link
                href="/editor"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-rose-500 to-orange-500 text-white font-bold text-xs shadow-lg hover:opacity-90 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                Create Card Now
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((c) => (
                <div
                  key={c.id}
                  className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-bold uppercase tracking-wider">
                        {c.status}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">/c/{c.slug}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {c.photoData ? (
                        <img src={c.photoData} alt={c.name} className="w-12 h-12 rounded-full object-cover border border-slate-700" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-rose-500 text-white font-bold text-xl flex items-center justify-center">
                          {c.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-extrabold text-base font-grotesk text-white">{c.name}</h4>
                        <p className="text-xs text-slate-400 truncate max-w-[180px]">{c.title}</p>
                      </div>
                    </div>

                    {/* Stats pill */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-2.5 rounded-2xl text-center text-[11px]">
                      <div>
                        <span className="block text-slate-400 font-medium">Views</span>
                        <span className="font-bold text-purple-400">{c.views || 0}</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-medium">Clicks</span>
                        <span className="font-bold text-rose-400">{c.linkClicks || 0}</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-medium">Saves</span>
                        <span className="font-bold text-orange-400">{c.saves || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-900 grid grid-cols-4 gap-2 text-xs">
                    <Link
                      href={`/c/${c.slug}`}
                      target="_blank"
                      title="View Public Card"
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center justify-center transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-rose-400" />
                    </Link>

                    <button
                      onClick={() => handleCopyLink(c.slug!, c.id!)}
                      title="Copy Public Link"
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center justify-center transition-colors"
                    >
                      {copiedId === c.id ? <Check className="w-4 h-4 text-rose-400" /> : <Copy className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => setSelectedQrCard(c)}
                      title="Show QR Code"
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center justify-center transition-colors"
                    >
                      <QrCode className="w-4 h-4 text-purple-400" />
                    </button>

                    <button
                      onClick={() => router.push(`/editor?id=${c.id}`)}
                      title="Edit Card"
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center justify-center transition-colors"
                    >
                      <Edit className="w-4 h-4 text-orange-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {selectedQrCard && (
        <QrCodeModal
          slug={selectedQrCard.slug!}
          cardName={selectedQrCard.name}
          onClose={() => setSelectedQrCard(null)}
        />
      )}
    </div>
  );
}
