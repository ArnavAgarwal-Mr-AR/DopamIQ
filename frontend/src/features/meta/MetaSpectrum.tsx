import React from "react";

type Props = {
  predictability: number;
  drift: number;
  susceptibility: number;
};

const MetaSpectrum: React.FC<Props> = ({ predictability, drift, susceptibility }) => {
  const metrics = [
    { label: "Predictability", value: Math.round(predictability), color: "#3b82f6" },
    { label: "Drift", value: Math.round(drift), color: "#10b981" },
    { label: "Susceptibility", value: Math.round(susceptibility), color: "#ef4444" },
  ];

  return (
    <div className="w-full py-20 px-4 relative">
      {/* The Spectrum Bar */}
      <div className="relative h-4 w-full bg-white/5 rounded-full border border-white/5 overflow-hidden">
        {/* Deep Gradient Fill */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 via-emerald-600/40 to-red-600/40" />
      </div>
      
      {/* Dynamic Pointers Component */}
      <div className="absolute inset-x-4 top-20 h-4 pointer-events-none">
        {metrics.map((m, idx) => {
          const isOdd = idx % 2 === 0;
          return (
            <div 
              key={idx}
              className="absolute transition-all duration-1000 ease-out"
              style={{ left: `${m.value}%` }}
            >
              {/* The Marker Line on the Bar */}
              <div className="w-0.5 h-4 bg-white shadow-[0_0_8px_white] relative z-20" />
              
              {/* Connector & Label - Staggered */}
              <div className={`absolute left-1/2 -translate-x-1/2 flex flex-col items-center ${isOdd ? 'bottom-full mb-4' : 'top-full mt-4'}`}>
                {isOdd && (
                  <>
                    <div className="text-center mb-2">
                       <span className="block text-2xl font-black text-white tabular-nums leading-none mb-1">{m.value}</span>
                       <span className="block text-[8px] font-black uppercase tracking-[0.3em]" style={{ color: m.color }}>{m.label}</span>
                    </div>
                    <div className="w-px h-8 bg-gradient-to-t from-white/40 to-transparent" />
                  </>
                )}
                {!isOdd && (
                  <>
                    <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
                    <div className="text-center mt-2">
                       <span className="block text-[8px] font-black uppercase tracking-[0.3em] mb-1" style={{ color: m.color }}>{m.label}</span>
                       <span className="block text-2xl font-black text-white tabular-nums leading-none">{m.value}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      
    </div>
  );
};

export default MetaSpectrum;
