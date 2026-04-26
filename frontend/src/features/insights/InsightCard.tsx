import React from "react";

type Props = {
  title: string;
  description: string;
};

const InsightCard: React.FC<Props> = ({ title, description }) => {
  return (
    <div className="glass-card p-4">
      <h4 className="font-black text-[10px] uppercase tracking-widest mb-1 text-white">{title}</h4>
      <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{description}</p>
    </div>
  );
};

export default InsightCard;