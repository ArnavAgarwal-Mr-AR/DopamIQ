import React from "react";

type Props = {
  minutes: number;
};

const DurationDisplay: React.FC<Props> = ({ minutes }) => {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-7xl font-black text-white tracking-tighter tabular-nums drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
        {Math.round(minutes)}
      </span>
      <span className="text-xl font-black text-gray-700 italic">min</span>
    </div>
  );
};

export default DurationDisplay;