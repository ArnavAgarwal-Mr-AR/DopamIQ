import React from "react";

type Props = {
  title: string;
  value: number;
};

const TOOLTIP_DATA: Record<string, string> = {
  Discipline: "Your ability to conclude viewing sessions without succumbing to the 'Next Episode' or 'Recommended' nudges.",
  Focus: "Measures title stickiness; how often you complete a single content arc versus grazing across multiple titles.",
  Curiosity: "Genre entropy; your historical willingness to bypass the algorithm's comfort zone and explore new formats.",
  Consistency: "The mathematical regularity of your viewing windows. High consistency implies a rigid temporal habit.",
  Impulsivity: "Measures decision latency; the speed at which you accept recommendations and initiate new sessions.",
};

const ScoreCard: React.FC<Props> = ({ title, value }) => {
  const [showTooltip, setShowTooltip] = React.useState(false);

  return (
    <div 
      className="glass-card flex flex-col items-center justify-center py-6 px-6 group hover:translate-y-[-2px] relative cursor-help"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {showTooltip && (
        <div className="absolute inset-0 z-50 bg-[#050505] p-6 rounded-3xl border border-white/10 flex flex-col justify-center animate-in fade-in zoom-in-95 duration-200">
          <b className="text-white text-[10px] uppercase tracking-widest block mb-2">{title}</b>
          <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
            {TOOLTIP_DATA[title] || "Behavioral intelligence metric derived from viewing activity signatures."}
          </p>
        </div>
      )}
      <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-600 group-hover:text-blue-500 transition-colors mb-1">{title}</h4>
      <div className="text-4xl font-black text-white tracking-tight tabular-nums">
        {Math.round(value)}
      </div>
      <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000" 
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  );
};

export default ScoreCard;