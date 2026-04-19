import React from "react";
import Card from "../../components/ui/Card";

type Props = {
  title: string;
  value: number;
};

const ScoreCard: React.FC<Props> = ({ title, value }) => {
  return (
    <Card className="flex flex-col items-center justify-center p-0 py-4 px-6 group hover:translate-y-[-2px]">
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
    </Card>
  );
};

export default ScoreCard;