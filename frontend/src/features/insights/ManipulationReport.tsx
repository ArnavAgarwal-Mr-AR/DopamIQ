import React from "react";
import Card from "../../components/ui/Card";

type Metric = {
  id: string;
  label: string;
  value: string;
  description: string;
  color: string;
};

type Props = {
  data: {
    metrics: Metric[];
    summary: string;
  } | null;
  loading: boolean;
};

const ManipulationReport: React.FC<Props> = ({ data, loading }) => {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  if (loading) return <div className="animate-pulse h-64 bg-white/5 rounded-3xl" />;
  if (!data) return null;

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4 text-[10px] font-black tracking-[0.4em] uppercase">
        <span className="text-gray-600">Status:</span>
        <div 
          className="relative cursor-help"
          onMouseEnter={() => setActiveId('threat-status')}
          onMouseLeave={() => setActiveId(null)}
        >
          <span className="text-red-500 animate-pulse bg-red-950/20 px-3 py-1 rounded border border-red-900/40">Critical Manipulation Risk Identified</span>
          {activeId === 'threat-status' && (
            <div className="absolute top-full left-0 mt-4 z-[100] w-64 bg-black border border-red-900/40 p-4 rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
               <b className="text-red-500 text-[9px] uppercase tracking-widest block mb-2">Threat Assessment</b>
               <p className="text-[10px] text-gray-400 leading-relaxed font-medium">A high probability that your biological decision-making has been successfully substituted by the platform's UI architecture.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {data.metrics.map((m) => {
          const isActive = activeId === m.id;
          return (
            <div 
              key={m.id} 
              className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col justify-between group hover:border-red-500/30 transition-all relative cursor-help"
              onMouseEnter={() => setActiveId(m.id)}
              onMouseLeave={() => setActiveId(null)}
            >
              {isActive && (
                <div className="absolute inset-0 z-50 bg-[#050505] p-6 rounded-2xl border border-red-500/20 flex flex-col justify-center animate-in fade-in zoom-in-95 duration-200">
                  <b className="text-white text-[9px] uppercase tracking-widest block mb-2">{m.label}</b>
                  <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                    {m.description}
                  </p>
                </div>
              )}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-gray-700 uppercase tracking-[0.2em] group-hover:text-red-500 transition-colors">{m.label}</span>
                  <span className="text-lg font-black text-white tabular-nums">{m.value}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative p-10 bg-[#080808] border border-white/5 rounded-3xl overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-900/5 blur-[100px] pointer-events-none" />
        <h4 className="text-[9px] font-black text-red-500 uppercase tracking-[0.5em] mb-6 border-b border-red-900/20 pb-4 inline-block">Final Intelligence Memo</h4>
        <p className="text-lg font-medium leading-relaxed italic text-gray-400 max-w-4xl">
          "{data.summary}"
        </p>
      </div>
    </div>
  );
};

export default ManipulationReport;
