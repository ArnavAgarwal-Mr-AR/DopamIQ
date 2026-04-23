import React, { useState, useEffect } from "react";
import BehavioralForecastGraph, { ViewMode } from "./BehavioralForecastGraph";

type Props = {
  onSubmit: (scenario: any) => void;
};

const VIEW_LABELS: Record<ViewMode, string> = {
  day:   'Hourly Pattern',
  month: 'Last 30 Days',
  year:  'All-Time History',
};

const TARGET_LABELS: Record<ViewMode, string> = {
  day:   '',       // filled dynamically with current time
  month: '30D AGGR',
  year:  'ANNUAL',
};

const SimulationForm: React.FC<Props> = ({ onSubmit }) => {
  const [view, setView] = useState<ViewMode>('day');

  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = days[now.getDay()];
  const hour = now.getHours();
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  const currentTimeString = `${dayName} ${hour12} ${ampm}`;

  useEffect(() => {
    onSubmit({ time: currentTimeString, device: "all", mode: view });
  }, [view]);

  const headerLeft = view === 'day' ? dayName : VIEW_LABELS[view];
  const headerRight = view === 'day' ? `${hour12}:00 ${ampm}` : TARGET_LABELS[view];

  return (
    <div className="space-y-6">
      <div className="glass-card py-10 px-8 text-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-opacity">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
        </div>

        <div className="flex justify-between items-center mb-6">
          {/* Left: context label */}
          <div className="text-left">
            <h3 className="text-blue-500 text-[9px] font-black uppercase tracking-[0.4em] mb-1">Temporal Alignment</h3>
            <p className="text-xl font-black text-white">{headerLeft}</p>
          </div>

          {/* Centre: 3-way toggle */}
          <div className="bg-white/5 p-1 rounded-full border border-white/10 flex gap-1">
            {(['day', 'month', 'year'] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${
                  view === v ? 'bg-white text-black' : 'text-gray-500 hover:text-white'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Right: time / range label */}
          <div className="text-right">
            <h3 className="text-gray-600 text-[9px] font-black uppercase tracking-[0.4em] mb-1">Target Capture</h3>
            <p className="text-xl font-black text-white">{headerRight}</p>
          </div>
        </div>

        <BehavioralForecastGraph view={view} />

        <p className="text-[9px] text-gray-600 mt-12 uppercase tracking-[0.4em] font-bold text-center">
          {view === 'day'   && `Hourly activity pattern — all-time ${dayName} history`}
          {view === 'month' && 'Daily activity — last 30 days'}
          {view === 'year'  && 'Monthly aggregates — full history'}
        </p>
      </div>
    </div>
  );
};

export default SimulationForm;