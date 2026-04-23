import React from 'react';
import {
  AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { apiClient, isSessionValid } from '../../services/apiClient';

export type ViewMode = 'day' | 'month' | 'year';

type Props = {
  view: ViewMode;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-xl">
        <p className="text-[10px] font-black text-gray-500 mb-3 uppercase tracking-[0.3em] border-b border-white/5 pb-2">
          {label} // DATA SNAPSHOT
        </p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between gap-8 items-center">
              <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: entry.color }}>
                {entry.name}
              </span>
              <span className="text-sm font-black text-white tabular-nums">
                {entry.dataKey === 'duration'
                  ? `${Math.round(entry.value)}m`
                  : `${Math.round(entry.value)}%`}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const BehavioralForecastGraph: React.FC<Props> = ({ view }) => {
  const [data, setData] = React.useState<any[]>([]);

  // Tiered Sapphire Palette
  const COLORS = {
    pulse: "#3b82f6",   // Luminous Azure
    depth: "#ffffff",   // Ice White
    risk: "#1d4ed8",    // Deep Cobalt
  };

  React.useEffect(() => {
    if (!isSessionValid()) return;

    const fetchData = async () => {
      try {
        const signals = await apiClient(`/trends/signals?view=${view}`);
        if (signals && signals.length) {
          setData(signals);
        }
      } catch {
        // apiClient handles session expiry redirect
      }
    };

    fetchData();
  }, [view]);

  const tickFormatter = (value: string) => {
    if (view === 'day') return `${value}:00`;
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    if (view === 'year') return `${months[date.getMonth()]}`;
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  if (!data.length) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <p className="text-[10px] font-black uppercase tracking-[1em] text-white/5 animate-pulse">Syncing_Nodes</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[350px] relative group select-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.pulse} stopOpacity={0.15} />
              <stop offset="95%" stopColor={COLORS.pulse} stopOpacity={0} />
            </linearGradient>
            
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.15)', fontSize: 8, fontWeight: 900 }}
            tickFormatter={tickFormatter}
            interval={view === 'day' ? 2 : Math.max(1, Math.floor(data.length / 8))}
          />
          
          <YAxis hide domain={[0, 100]} />
          
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }} 
          />
          
          {/* 1. Pulse Area (Solid Blue) */}
          <Area 
            name="PULSE"
            type="monotone" 
            dataKey="prob" 
            stroke={COLORS.pulse} 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorPulse)" 
            filter="url(#glow)"
            animationDuration={1500} 
          />

          {/* 2. Depth Area (Dashed White) */}
          <Area 
            name="DEPTH"
            type="monotone" 
            dataKey="duration" 
            stroke={COLORS.depth} 
            strokeWidth={2} 
            strokeDasharray="6 4"
            fill="transparent"
            animationDuration={2000} 
          />

          {/* 3. Risk Area (Solid Deep Blue) */}
          <Area 
            name="RISK"
            type="monotone" 
            dataKey="binge" 
            stroke={COLORS.risk} 
            strokeWidth={1} 
            fill="transparent"
            animationDuration={2500} 
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Tonal Legend */}
      <div className="flex justify-center gap-10 mt-8">
        {[
          { label: 'PULSE', color: COLORS.pulse, type: 'solid' },
          { label: 'DEPTH', color: COLORS.depth, type: 'dashed' },
          { label: 'RISK', color: COLORS.risk, type: 'line' }
        ].map(item => (
          <div key={item.label} className="flex items-center gap-3 group/legend cursor-help">
            <div 
              className={`h-0.5 w-4 ${item.type === 'dashed' ? 'border-t-2 border-dashed' : 'bg-current'}`} 
              style={{ color: item.color, backgroundColor: item.type === 'dashed' ? 'transparent' : item.color }} 
            />
            <span className="text-[8px] font-black text-white/20 tracking-[0.4em] uppercase group-hover/legend:text-white/50 transition-colors">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};




export default BehavioralForecastGraph;
