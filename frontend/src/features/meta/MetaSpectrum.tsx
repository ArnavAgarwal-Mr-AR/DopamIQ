import React from "react";

type Props = {
  predictability: number;
  drift: number;
  susceptibility: number;
};

const META_TOOLTIPS: Record<string, string> = {
  Predictability: "The algorithmic certainty of your next action. High scores mean your habits are so refined that they lack statistical surprise.",
  Drift: "The divergence of your current viewing profile from your long-term historical baseline. Measures core taste evolution.",
  Susceptibility: "Your mathematical vulnerability to behavioral nudges, 'Just for You' carousels, and the platform's UI flow.",
};

const MetaSpectrum: React.FC<Props> = ({ predictability, drift, susceptibility }) => {
  const [activeMetric, setActiveMetric] = React.useState<number | null>(null);

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
      <div className="absolute inset-0 pointer-events-none">
        {metrics.map((m, idx) => {
          const isOdd = idx % 2 === 0;
          const isActive = activeMetric === idx;

          return (
            <div 
              key={idx}
              className="absolute top-0 bottom-0 transition-all duration-1000 ease-out"
              style={{ left: `${m.value}%` }}
            >
              {/* The Marker Line on the Bar */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 w-0.5 h-4 bg-white shadow-[0_0_8px_white] z-20" />
              
              {/* Connector & Label - Staggered */}
              <div 
                className={`absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto cursor-help p-12 group ${isOdd ? 'bottom-1/2 mb-2' : 'top-1/2 mt-2'}`}
                onMouseEnter={() => setActiveMetric(idx)}
                onMouseLeave={() => setActiveMetric(null)}
              >
                {isActive && (
                  <div 
                    className={`absolute z-[999] w-72 bg-black border border-white/20 p-6 rounded-2xl text-left shadow-[0_0_100px_rgba(0,0,0,1)] animate-in fade-in zoom-in-95 duration-200 backdrop-blur-3xl
                      ${isOdd ? 'bottom-0 -mb-2' : 'top-0 -mt-2'}
                      ${m.value < 20 ? 'left-0 translate-x-0' : m.value > 80 ? 'right-0 -translate-x-full' : 'left-1/2 -translate-x-1/2'}`}
                  >
                    <b className="text-white text-[10px] uppercase tracking-widest block mb-2">{m.label}</b>
                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed">{META_TOOLTIPS[m.label]}</p>
                  </div>
                )}
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
