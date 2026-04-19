import React from "react";

type ExplanationData = {
  title: string;
  summary: string;
  traits: string[];
};

type Props = {
  text: ExplanationData | string;
};

const ExplanationBlock: React.FC<Props> = ({ text }) => {
  if (typeof text === 'string') {
    return (
      <div className="bg-gray-50 border rounded-xl p-4 text-sm text-gray-700">
        {text}
      </div>
    );
  }

  // Handle structured JSON gracefully
  return (
    <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group">
      {/* Absolute Decorative Layer */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-all duration-1000" />
      
      <div className="relative z-10 space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">The Profile</span>
          <h3 className="text-xl md:text-3xl font-black text-white tracking-tight leading-none italic">{text.title}</h3>
        </div>

        <p className="text-base text-gray-400 font-medium leading-relaxed max-w-3xl">
          {text.summary}
        </p>
      </div>
    </div>
  );
};

export default ExplanationBlock;