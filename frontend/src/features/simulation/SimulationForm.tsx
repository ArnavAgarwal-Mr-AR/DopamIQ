import React, { useState, useEffect } from "react";

type Props = {
  onSubmit: (scenario: any) => void;
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const PHASES = [
  { label: 'Dawn', time: '5 AM' },
  { label: 'Morning', time: '10 AM' },
  { label: 'Afternoon', time: '2 PM' },
  { label: 'Evening', time: '7 PM' },
  { label: 'Late Night', time: '1 AM' }
];
const DEVICES = ['Mobile', 'Smart TV', 'Desktop / Web'];

const SimulationForm: React.FC<Props> = ({ onSubmit }) => {
  const [day, setDay] = useState('Friday');
  const [phase, setPhase] = useState(PHASES[4]); // Default to Late Night
  const [device, setDevice] = useState('Smart TV');

  const triggerSubmit = () => {
    onSubmit({
      time: `${day} ${phase.time}`,
      device: device.toLowerCase(),
      mode: 'day' // Simulation is always a 'day' context prediction
    });
  };

  // Initial trigger
  useEffect(() => {
    triggerSubmit();
  }, []);

  return (
    <div className="glass-card p-10 relative overflow-hidden group mb-12">
      <div className="flex flex-col md:flex-row gap-12 justify-between items-start">
        
        {/* 1. Day Selector */}
        <div className="flex-1">
          <h4 className="text-[9px] font-black text-blue-500 uppercase tracking-[0.4em] mb-6">01 // Temporal Day</h4>
          <div className="flex flex-wrap gap-2">
            {DAYS.map(d => (
              <button
                key={d}
                onClick={() => { setDay(d); setTimeout(triggerSubmit, 10); }}
                className={`px-3 py-2 rounded text-[10px] font-black transition-all border ${
                  day === d ? 'bg-white text-black border-white' : 'bg-transparent text-gray-500 border-white/10 hover:border-white/30'
                }`}
              >
                {d.slice(0, 3).toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Phase Selector */}
        <div className="flex-1">
          <h4 className="text-[9px] font-black text-amber-500 uppercase tracking-[0.4em] mb-6">02 // Diurnal Phase</h4>
          <div className="grid grid-cols-2 gap-2 w-full">
            {PHASES.map(p => (
              <button
                key={p.label}
                onClick={() => { setPhase(p); setTimeout(triggerSubmit, 10); }}
                className={`px-4 py-3 rounded-xl text-left transition-all border flex justify-between items-center ${
                  phase.label === p.label ? 'bg-amber-500/10 border-amber-500 text-white' : 'bg-transparent text-gray-600 border-white/5 hover:border-white/20'
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest">{p.label}</span>
                <span className="text-[8px] font-medium opacity-50">{p.time}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Device Selector */}
        <div className="flex-1 w-full md:w-auto">
          <h4 className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-6">03 // Device Context</h4>
          <div className="space-y-2">
            {DEVICES.map(dev => (
              <button
                key={dev}
                onClick={() => { setDevice(dev); setTimeout(triggerSubmit, 10); }}
                className={`w-full px-4 py-3 rounded-xl text-left transition-all border flex items-center gap-3 ${
                  device === dev ? 'bg-emerald-500/10 border-emerald-500 text-white' : 'bg-transparent text-gray-600 border-white/5 hover:border-white/20'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${device === dev ? 'bg-emerald-500 animate-pulse' : 'bg-white/10'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest">{dev}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center">
        <p className="text-[8px] text-gray-600 font-black uppercase tracking-[0.4em]">
          Target: {day.toUpperCase()} // {phase.label.toUpperCase()} // {device.toUpperCase()}
        </p>
        <div className="flex gap-1">
          {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-white/10" />)}
        </div>
      </div>
    </div>
  );
};

export default SimulationForm;