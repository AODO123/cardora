"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, QrCode, Copy, Check, Download, ExternalLink } from "lucide-react";
import QRCode from "qrcode";

interface QrCodeModalProps {
  slug: string;
  cardName: string;
  onClose: () => void;
}

export function QrCodeModal({ slug, cardName, onClose }: QrCodeModalProps) {
  const [qrUrl, setQrUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const cardUrl = typeof window !== "undefined" ? `${window.location.origin}/c/${slug}` : `https://cardora.io/c/${slug}`;

  useEffect(() => {
    QRCode.toDataURL(cardUrl, { width: 300, margin: 2, color: { dark: "#000000", light: "#ffffff" } })
      .then((url) => setQrUrl(url))
      .catch((err) => console.error("QR Code error:", err));
  }, [cardUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(cardUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrUrl) return;
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = `${slug}-qr-code.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-sm bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white text-center"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <QrCode className="w-5 h-5 text-rose-400" />
          <h3 className="font-extrabold text-lg font-grotesk">Share Card & QR Code</h3>
        </div>
        <p className="text-xs text-slate-400 mb-6">{cardName}'s Digital Card</p>

        {/* QR Image Frame */}
        <div className="bg-white p-4 rounded-2xl inline-block shadow-xl border-4 border-rose-500/30 mb-6">
          {qrUrl ? (
            <img src={qrUrl} alt={`QR Code for ${cardName}`} className="w-48 h-48 mx-auto" />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-xs">
              Generating QR...
            </div>
          )}
        </div>

        {/* URL Field */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 mb-4 flex items-center justify-between text-xs text-slate-300">
          <span className="truncate max-w-[200px] text-rose-400 font-mono">{cardUrl}</span>
          <button
            onClick={handleCopyLink}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors flex items-center gap-1 font-semibold"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-rose-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDownloadQr}
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-500 via-rose-500 to-orange-500 hover:opacity-90 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md"
          >
            <Download className="w-4 h-4" />
            Download QR
          </button>
          <a
            href={`/c/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all"
          >
            <ExternalLink className="w-4 h-4 text-rose-400" />
            Open Link
          </a>
        </div>
      </motion.div>
    </div>
  );
}
