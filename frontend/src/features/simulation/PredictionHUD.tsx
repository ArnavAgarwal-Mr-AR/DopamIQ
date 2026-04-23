import React from 'react';

type PredictionData = {
  action: string;
  probability: number;
  duration: number;
  binge: boolean;
  strategy: string;
  confidence?: number;
};

type Props = {
  data: PredictionData | null;
  loading: boolean;
};

const PredictionHUD: React.FC<Props> = ({ data, loading }) => {
  if (!data && !loading) return null;

  return (
    <div className={`mt-8 transition-all duration-700 ${loading ? 'opacity-50 grayscale' : 'opacity-100'}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Metric: Action State */}
        <div className="bg-white/[0.03] border border-white/5 p-6 border-l-4 border-blue-500/50 relative group overflow-hidden rounded-2xl">
          <div className="absolute top-0 right-0 p-2 text-[8px] font-black text-blue-500/30 uppercase tracking-widest">State_Analysis</div>
          <h5 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Predicted State</h5>
          <div className="text-xl font-black text-white tracking-tighter group-hover:text-blue-400 transition-colors">
            {loading ? "CALIBRATING..." : data?.action}
          </div>
          <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${data?.binge ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: loading ? '30%' : '100%' }}
            />
          </div>
        </div>

        {/* Metric: Probability */}
        <div className="bg-white/[0.03] border border-white/5 p-6 border-l-4 border-amber-500/50 relative group overflow-hidden rounded-2xl">
          <div className="absolute top-0 right-0 p-2 text-[8px] font-black text-amber-500/30 uppercase tracking-widest">Neural_Confidence</div>
          <h5 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Session Probability</h5>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white tracking-tighter">
              {loading ? "--" : data?.probability}
            </span>
            <span className="text-xs font-black text-amber-500/60">%</span>
          </div>
          <p className={`text-[9px] font-bold uppercase mt-2 tracking-widest ${data?.confidence !== undefined && data.confidence < 80 ? 'text-amber-500 animate-pulse' : 'text-gray-600'}`}>
            {loading ? "CALIBRATING..." : (data?.confidence !== undefined && data.confidence < 80 ? "HEURISTIC CALIBRATION" : "HISTORICAL ALIGNMENT")}
          </p>
        </div>

        {/* Metric: Duration */}
        <div className="bg-white/[0.03] border border-white/5 p-6 border-l-4 border-emerald-500/50 relative group overflow-hidden rounded-2xl">
          <div className="absolute top-0 right-0 p-2 text-[8px] font-black text-emerald-500/30 uppercase tracking-widest">Capture_Window</div>
          <h5 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Expected Intensity</h5>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white tracking-tighter">
              {loading ? "--" : data?.duration}
            </span>
            <span className="text-xs font-black text-emerald-500/60">MIN</span>
          </div>
          <p className="text-[9px] text-gray-600 font-bold uppercase mt-2 tracking-widest">
            Target engagement depth
          </p>
        </div>
      </div>

      {/* Strategy Block */}
      <div className="mt-4 bg-blue-500/5 border border-blue-500/20 p-6 relative group rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <h5 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-1">Algorithmic Exploitation Strategy</h5>
            <p className="text-sm font-bold text-white tracking-tight leading-relaxed">
              {loading ? "ANALYZING RETENTION VECTORS..." : data?.strategy}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionHUD;
