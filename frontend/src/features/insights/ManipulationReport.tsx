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
  if (loading) return <div className="animate-pulse h-64 bg-gray-100 rounded-xl" />;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="bg-red-950 text-red-400 px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded border border-red-900/50 w-fit">
        System Threat Assessment: UI Manipulation
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.metrics.map((m) => (
          <div key={m.id} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{m.label}</span>
              <span className={`text-lg font-black text-${m.color}-600`}>{m.value}</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors">
              {m.description}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 text-gray-100 p-6 rounded-xl border-l-4 border-red-600 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
        </div>
        <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3">Intelligence Summary</h4>
        <p className="text-base font-medium leading-relaxed italic opacity-90">
          "{data.summary}"
        </p>
      </div>
    </div>
  );
};

export default ManipulationReport;
