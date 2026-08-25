"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CardPreview, CardData } from "@/components/CardPreview";
import { QrCodeModal } from "@/components/QrCodeModal";
import { NfcPrototypeModal } from "@/components/NfcPrototypeModal";
import { AlertCircle, Radio, Sparkles } from "lucide-react";

export default function PublicCardPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showQrModal, setShowQrModal] = useState(false);
  const [showNfcModal, setShowNfcModal] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchCard();
    }
  }, [slug]);

  const fetchCard = async () => {
    try {
      const res = await fetch(`/api/cards/by-slug/${slug}`);
      if (!res.ok) {
        throw new Error("Digital business card not found.");
      }
      const data = await res.json();
      setCard(data.card);
    } catch (err: any) {
      setError(err.message || "Failed to load card.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContact = async () => {
    if (!card) return;
    // Trigger .vcf download via /api/vcard/[slug]
    window.location.href = `/api/vcard/${card.slug}`;

    // Track save stat
    if (card.id) {
      fetch(`/api/cards/${card.id}/save`, { method: "POST" }).catch(console.error);
    }
  };

  const handleSocialClick = (platform: string, url: string) => {
    if (card && card.id) {
      fetch(`/api/cards/${card.id}/click`, { method: "POST" }).catch(console.error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-between">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-lime-400 border-t-transparent animate-spin" />
          <p className="text-xs font-semibold text-slate-400">Loading digital card...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-between">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center max-w-md mx-auto space-y-4">
          <div className="p-4 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-grotesk">Card Not Found</h2>
          <p className="text-xs text-slate-400">
            The digital business card link <code className="text-lime-400">/c/{slug}</code> does not exist or has been removed.
          </p>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl bg-lime-400 text-black font-bold text-xs shadow-lg hover:bg-lime-300 transition-all"
          >
            Create Your Own Card
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-white flex flex-col justify-between selection:bg-lime-400 selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-4">
          {/* Cardora Verified Badge */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-lime-400" />
            <span>Cardora Digital Business Card</span>
          </div>

          {/* Core Profile Card */}
          <CardPreview
            card={card}
            onSaveContact={handleSaveContact}
            onShare={() => setShowQrModal(true)}
            onSocialClick={handleSocialClick}
            onTriggerNfcDemo={() => setShowNfcModal(true)}
            isInteractive={true}
          />
        </div>
      </main>

      <Footer onOpenNfcDemo={() => setShowNfcModal(true)} />

      {/* QR Code Modal */}
      {showQrModal && (
        <QrCodeModal
          slug={card.slug || slug}
          cardName={card.name}
          onClose={() => setShowQrModal(false)}
        />
      )}

      {/* NFC Prototype Modal */}
      {showNfcModal && (
        <NfcPrototypeModal
          demoCard={card}
          onClose={() => setShowNfcModal(false)}
        />
      )}
    </div>
  );
}
