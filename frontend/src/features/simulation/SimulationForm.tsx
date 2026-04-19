import React, { useState } from "react";
import ScenarioInputs from "./ScenarioInputs";
import Button from "../../components/ui/Button";

type Props = {
  onSubmit: (scenario: any) => void;
};

const SimulationForm: React.FC<Props> = ({ onSubmit }) => {
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

  return (
    <div className="space-y-6">
      <div className="glass-card p-10 text-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-opacity">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="white"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
        </div>
        <h3 className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-3">Temporal Context Locked</h3>
        <p className="text-4xl font-black text-white tracking-tighter">{currentTimeString}</p>
        <p className="text-[10px] text-gray-500 mt-4 uppercase tracking-widest font-bold">Predicting session start via Desktop Web</p>
      </div>

      <button 
        onClick={() => onSubmit({ time: currentTimeString, device: "laptop" })} 
        className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
      >
        Simulate Reaction
      </button>
    </div>
  );
};

export default SimulationForm;