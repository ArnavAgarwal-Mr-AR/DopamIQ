import React, { useState } from "react";
import TrendsLayout from "./TrendsLayout";
import { useTrends } from "../../hooks/useTrends";
import LineChart from "../../components/charts/LineChart";
import Heatmap from "../../components/charts/Heatmap";
import SectionContainer from "../../components/layout/SectionContainer";
import BehavioralForecastGraph, { ViewMode } from "../../features/simulation/BehavioralForecastGraph";

const Trends: React.FC = () => {
  const { data: trendsData, loading: trendsLoading } = useTrends();
  const [view, setView] = React.useState<ViewMode>("day");

  if (trendsLoading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-[10px] font-black uppercase tracking-[1em] text-blue-500/20 animate-pulse">Scanning_Neural_Matrix</p>
    </div>
  );

  if (!trendsData) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-[10px] font-black uppercase tracking-[1em] text-white/10">No_Session_Depth_Detected</p>
    </div>
  );

  return (
    <TrendsLayout>
      <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col items-center">
        
        {/* Compact Navigation Hub */}
        <div className="w-full flex flex-col items-center gap-12">
          <nav className="flex gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/5 backdrop-blur-3xl shadow-3xl">
            {(["day", "month", "year"] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-8 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.4em] transition-all duration-700 ${
                  view === v 
                    ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]" 
                    : "text-white/20 hover:text-white/50"
                }`}
              >
                {v}
              </button>
            ))}
          </nav>

          {/* Minimalist Graph HUD */}
          <div className="w-full space-y-6 relative">
            {/* Background Glow Aura */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
            
            <header className="flex justify-between items-end border-b border-white/5 pb-4 relative z-10">
              <h2 className="text-xl font-black text-white tracking-tighter uppercase opacity-80">
                {view === 'day' ? 'Daily_Pulse' : view === 'month' ? 'Monthly_Depth' : 'Annual_Horizon'}
              </h2>
              <span className="text-[8px] font-black text-white/10 tracking-[0.5em] uppercase">Temporal_Lock: Active</span>
            </header>
            
            <div className="relative z-10 py-4">
              <BehavioralForecastGraph view={view} />
            </div>
          </div>
        </div>

        {/* HUD Footer */}
        <footer className="mt-32 opacity-10">
          <p className="text-[7px] font-black uppercase tracking-[1.5em] text-white">Dopamiq_Neural_Audit_v2.4</p>
        </footer>
      </div>
    </TrendsLayout>
  );
};






export default Trends;
