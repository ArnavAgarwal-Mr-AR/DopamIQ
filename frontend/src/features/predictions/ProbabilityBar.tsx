import React from "react";

type Props = {
  label: string;
  value: number;
  color?: "blue" | "red" | "purple";
};

const ProbabilityBar: React.FC<Props> = ({ label, value, color = "blue" }) => {
  const colorMap = {
    blue: "from-blue-600 to-blue-400",
    red: "from-red-600 to-red-400",
    purple: "from-purple-600 to-purple-400",
  };

  return (
    <div className="space-y-2">
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