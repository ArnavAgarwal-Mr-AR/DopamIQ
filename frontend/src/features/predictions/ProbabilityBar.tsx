import React from "react";

type Props = {
  label: string;
  value: number;
  color?: "blue" | "red" | "purple";
};

const PREDICTION_TOOLTIPS: Record<string, string> = {
  "Engagement Intent": "The mathematical probability that you will actively interact with the platform UI (clicks/searches) within the next 15 minutes.",
  "Interest Attrition": "The risk of session abandonment. Reflects the likelihood that decision paralysis or mental fatigue will lead to a disconnect.",
  "Binge Propensity": "The statistical probability of 'Loop Retention'—specifically the likelihood of initiating the next episode immediately.",
};

const ProbabilityBar: React.FC<Props> = ({ label, value, color = "blue" }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const colorMap = {
    blue: "from-blue-600 to-blue-400",
    red: "from-red-600 to-red-400",
    purple: "from-purple-600 to-purple-400",
  };

  return (
    <div 
      className="space-y-2 relative cursor-help"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div className={`absolute -inset-x-6 -inset-y-4 bg-[#050505] border-l-2 border-white/10 p-5 rounded-xl z-50 animate-in fade-in zoom-in-95 duration-200 shadow-[0_0_50px_rgba(0,0,0,1)] flex flex-col justify-center`}
             style={{ borderLeftColor: color === 'blue' ? '#2563eb' : color === 'red' ? '#dc2626' : '#9333ea' }}>
          <b className="text-white text-[11px] uppercase tracking-[0.3em] block mb-2">{label}</b>
          <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
            {PREDICTION_TOOLTIPS[label] || "Algorithmic forecast derived from real-time behavioral signal analysis."}
          </p>
        </div>
      )}
      <div className="flex justify-between items-end">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">{label}</span>
        <span className="text-sm font-black text-white tabular-nums">{value}%</span>
      </div>
      <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
        <div
          className={`bg-gradient-to-r ${colorMap[color]} h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.1)]`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

export default ProbabilityBar;