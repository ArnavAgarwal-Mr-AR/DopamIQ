import React from "react";

type Props = {
  summary: string;
};

const SimulationSummary: React.FC<Props> = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="mt-12 bg-white/[0.02] border border-white/5 rounded-3xl p-10 relative overflow-hidden group">
      {/* Background Stylized Element */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500/60">Dopamiq v2.1 // Intelligence Brief</h4>
        <span className="text-[8px] font-black px-2 py-0.5 border border-emerald-500/30 text-emerald-500/50 rounded uppercase tracking-widest">Classification: Secure</span>
      </div>

      <div className="space-y-4">
        {summary.split(' | ').map((block, i) => (
          <p key={i} className="text-[13px] leading-relaxed text-gray-400 font-medium tracking-tight border-l border-white/5 pl-4">
            {block}
          </p>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center opacity-30">
        <span className="text-[8px] font-black uppercase tracking-widest">Source: Behavioral Engine // Core-01</span>
        <div className="flex gap-1">
            <div className="w-1 h-1 bg-white/20 rounded-full" />
            <div className="w-1 h-1 bg-white/20 rounded-full" />
            <div className="w-1 h-1 bg-white/20 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default SimulationSummary;