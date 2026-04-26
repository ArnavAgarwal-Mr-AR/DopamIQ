import React from "react";
import PredictionHUD from "./PredictionHUD";
import { ViewMode } from "./BehavioralForecastGraph";

type Props = {
  data: any;
  loading: boolean;
  view: ViewMode;
};

const VIEW_META: Record<ViewMode, {
  label: string;
  context: string;
  accent: string;
  accentHex: string;
  badge: string;
}> = {
  day: {
    label: "Dopamiq // Daily Pattern Brief",
    context: "This brief interprets your hourly watching distribution — when you are most active, when your sessions run longest, and when binge behaviour peaks within a single day cycle.",
    accent: "text-amber-400/60",
    accentHex: "#f59e0b",
    badge: "Temporal: 24H Window",
  },
  month: {
    label: "Dopamiq // Monthly Cycle Brief",
    context: "This brief analyses your day-by-day activity over the last 30 days — identifying active streaks, inactive gaps, and whether your engagement is trending up or down recently.",
    accent: "text-emerald-400/60",
    accentHex: "#10b981",
    badge: "Temporal: Last 30 Days",
  },
  year: {
    label: "Dopamiq // Historical Pattern Brief",
    context: "This brief maps your all-time monthly watch behaviour — surfacing seasonal shifts, long-term engagement cycles, and how your habits have evolved year over year.",
    accent: "text-orange-400/60",
    accentHex: "#f97316",
    badge: "Temporal: Full History",
  },
};

const SimulationSummary: React.FC<Props> = ({ data, loading, view }) => {
  if (!data && !loading) return null;

  const meta = VIEW_META[view] ?? VIEW_META.day;
  const summary = data?.summary || "";

  return (
    <div className="mt-12 bg-white/[0.02] border border-white/5 rounded-3xl p-10 relative overflow-hidden group">
      <div
        className="absolute top-0 left-0 w-full h-[1px]"
        style={{ background: `linear-gradient(to right, transparent, ${meta.accentHex}33, transparent)` }}
      />

      <div className="flex justify-between items-center mb-4">
        <h4 className={`text-[10px] font-black uppercase tracking-[0.4em] ${meta.accent}`}>
          {meta.label}
        </h4>
        <span
          className="text-[8px] font-black px-2 py-0.5 border rounded uppercase tracking-widest"
          style={{ borderColor: `${meta.accentHex}40`, color: `${meta.accentHex}80` }}
        >
          {meta.badge}
        </span>
      </div>

      {/* Neural Telemetry HUD */}
      <PredictionHUD data={data} loading={loading} />

      {/* Forensic Intelligence Brief Header */}
      <div className="mt-12 mb-6">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black mb-3 border-l-2 pl-3"
           style={{ borderColor: `${meta.accentHex}30` }}>
          {meta.context}
        </p>
      </div>

      {/* LLM-generated summary blocks */}
      <div className="space-y-4">
        {summary.split(' | ').map((block: string, i: number) => (
          <p key={i} className="text-[13px] leading-relaxed text-gray-400 font-medium tracking-tight border-l border-white/5 pl-4">
            {block}
          </p>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center opacity-30">
        <span className="text-[8px] font-black uppercase tracking-widest">Source: Behavioral Engine // Core-01</span>
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-white/20 rounded-full" />
          <div className="w-1 h-1 bg-white/20 rounded-full" />
          <div className="w-1 h-1 bg-white/20 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default SimulationSummary;
