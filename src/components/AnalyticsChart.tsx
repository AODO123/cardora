"use client";

import React from "react";
import { Eye, MousePointerClick, Download, TrendingUp } from "lucide-react";

interface AnalyticsChartProps {
  totalViews: number;
  totalLinkClicks: number;
  totalSaves: number;
}

export function AnalyticsChart({ totalViews, totalLinkClicks, totalSaves }: AnalyticsChartProps) {
  const maxVal = Math.max(totalViews, totalLinkClicks, totalSaves, 1);
  const viewsPct = Math.round((totalViews / maxVal) * 100);
  const clicksPct = Math.round((totalLinkClicks / maxVal) * 100);
  const savesPct = Math.round((totalSaves / maxVal) * 100);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-white font-grotesk tracking-tight">Card Engagement Performance</h3>
          <p className="text-xs text-slate-400">Real-time interactions tracked across all your digital cards</p>
        </div>
        <div className="p-2.5 rounded-2xl bg-lime-500/10 border border-lime-500/30 text-lime-400">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Views */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
            <Eye className="w-4 h-4 text-lime-400" />
            <span>Card Views</span>
          </div>
          <p className="text-2xl font-black text-white font-grotesk">{totalViews.toLocaleString()}</p>
        </div>

        {/* Link Clicks */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
            <MousePointerClick className="w-4 h-4 text-cyan-400" />
            <span>Social & Website Clicks</span>
          </div>
          <p className="text-2xl font-black text-white font-grotesk">{totalLinkClicks.toLocaleString()}</p>
        </div>

        {/* Contact Saves */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
            <Download className="w-4 h-4 text-rose-400" />
            <span>vCard Saves</span>
          </div>
          <p className="text-2xl font-black text-white font-grotesk">{totalSaves.toLocaleString()}</p>
        </div>
      </div>

      {/* Visual Progress Bar Breakdown */}
      <div className="space-y-4 pt-2 border-t border-slate-800/80">
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1.5">
            <span className="text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-lime-400" /> Card Views Ratio
            </span>
            <span className="text-slate-400">{viewsPct}% ({totalViews})</span>
          </div>
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
            <div className="bg-lime-400 h-full rounded-full transition-all duration-500" style={{ width: `${viewsPct}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold mb-1.5">
            <span className="text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> Link Clicks Ratio
            </span>
            <span className="text-slate-400">{clicksPct}% ({totalLinkClicks})</span>
          </div>
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
            <div className="bg-cyan-400 h-full rounded-full transition-all duration-500" style={{ width: `${clicksPct}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold mb-1.5">
            <span className="text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" /> Contact Saves Ratio
            </span>
            <span className="text-slate-400">{savesPct}% ({totalSaves})</span>
          </div>
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
            <div className="bg-rose-400 h-full rounded-full transition-all duration-500" style={{ width: `${savesPct}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
