"use client";

import React from "react";
import Image from "next/image";

interface CardoraLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function CardoraLogo({ className = "", size = 36, showText = true }: CardoraLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 group ${className}`}>
      <div
        className="relative flex items-center justify-center rounded-xl overflow-hidden shadow-[0_0_20px_rgba(244,63,94,0.35)] group-hover:scale-105 transition-transform shrink-0"
        style={{ width: size, height: size }}
      >
        <Image
          src="/logo.png"
          alt="Cardora Logo"
          width={size}
          height={size}
          className="object-cover rounded-xl"
        />
      </div>

      {showText && (
        <span className="text-xl font-black tracking-tight text-white font-grotesk">
          CARD<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-rose-400 to-orange-400">ORA</span>
        </span>
      )}
    </div>
  );
}
