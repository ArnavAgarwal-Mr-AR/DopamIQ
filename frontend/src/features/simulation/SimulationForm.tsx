import React, { useState, useEffect } from "react";
import BehavioralForecastGraph from "./BehavioralForecastGraph";

type Props = {
  onSubmit: (scenario: any) => void;
};

const SimulationForm: React.FC<Props> = ({ onSubmit }) => {
  const [view, setView] = useState<'day' | 'month'>('day');
  const [scenario, setScenario] = useState({
    time: "",
    device: "mobile",
  });

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

  return (
    <div className="space-y-6">
      <div className="glass-card py-10 px-8 text-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-opacity">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
        </div>
        
        <div className="flex justify-between items-center mb-6">
            <div className="text-left">
                <h3 className="text-blue-500 text-[9px] font-black uppercase tracking-[0.4em] mb-1">Temporal Alignment</h3>
                <p className="text-xl font-black text-white">{view === 'day' ? dayName : 'Active Cycle'}</p>
            </div>
            {/* View Toggle */}
            <div className="bg-white/5 p-1 rounded-full border border-white/10 flex gap-1">
                <button 
                  onClick={() => setView('day')}
                  className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${view === 'day' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                >Day</button>
                <button 
                  onClick={() => setView('month')}
                  className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${view === 'month' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                >Month</button>
            </div>
            <div className="text-right">
                <h3 className="text-gray-600 text-[9px] font-black uppercase tracking-[0.4em] mb-1">Target Capture</h3>
                <p className="text-xl font-black text-white">{view === 'day' ? `${hour12}:00 ${ampm}` : '30D AGGR'}</p>
            </div>
        </div>

        <BehavioralForecastGraph view={view} />
        
        <p className="text-[9px] text-gray-600 mt-12 uppercase tracking-[0.4em] font-bold text-center">Calculated Behavioral Entropy based on {dayName} History</p>
      </div>
    </div>
  );
};

export default SimulationForm;