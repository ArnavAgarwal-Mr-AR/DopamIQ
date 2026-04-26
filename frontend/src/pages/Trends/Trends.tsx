import React, { useState } from "react";
import TrendsLayout from "./TrendsLayout";
import { useTrends } from "../../hooks/useTrends";
import BehavioralForecastGraph, { ViewMode } from "../../features/simulation/BehavioralForecastGraph";

const Trends: React.FC = () => {
  const { data: trendsData, loading: trendsLoading } = useTrends();
  const [view, setView] = React.useState<ViewMode>("day");

  if (trendsLoading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-[10px] font-black uppercase tracking-[1em] text-white/20 animate-pulse">Scanning_Temporal_Data</p>
    </div>
  );

  if (!trendsData) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-[10px] font-black uppercase tracking-[1em] text-white/10">No_Session_History</p>
    </div>
  );

  return (
    <TrendsLayout>
      <div className="mb-12 space-y-1">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white italic whitespace-nowrap">Temporal Rhythm Analysis.</h2>
        <p className="text-gray-500 text-sm md:text-base font-medium">Mapping your behavioral pulse across different time horizons.</p>
      </div>

      {/* Creative Toggle Hub */}
      <div className="flex flex-col md:flex-row gap-6 mb-16">
        {(["day", "month", "year"] as ViewMode[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`flex-1 px-8 py-6 rounded-2xl border text-left transition-all duration-500 relative overflow-hidden group ${
              view === v 
                ? "bg-white/[0.03] border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.02)]" 
                : "bg-transparent border-white/5 hover:bg-white/[0.01] hover:border-white/10 opacity-60 hover:opacity-100"
            }`}
          >
            {view === v && (
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            )}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white block mb-1">
                  {v === "day" ? "24H Cycle" : v === "month" ? "30D Window" : "Past 12M"}
                </span>
                <span className="text-xs text-gray-500 font-medium tracking-wide">
                  {v === "day" ? "Hourly density & depth" : v === "month" ? "Daily active streaks" : "Year-over-year pacing"}
                </span>
              </div>
              <div className={`w-3 h-3 rounded-full border-2 ${view === v ? "border-white bg-white/20" : "border-white/20"}`} />
            </div>
          </button>
        ))}
      </div>

      {/* Graph Container */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
        <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/50">
            {view === "day" ? "Daily Pulse Signature" : view === "month" ? "Monthly Engagement Depth" : "12-Month Macro View"}
          </h3>
          <span className="text-[9px] font-black uppercase tracking-widest text-blue-500/60 border border-blue-500/20 px-3 py-1 rounded">
            All Metrics Active
          </span>
        </div>

        <div className="w-full">
          <BehavioralForecastGraph view={view} />
        </div>
      </div>
    </TrendsLayout>
  );
};

export default Trends;

