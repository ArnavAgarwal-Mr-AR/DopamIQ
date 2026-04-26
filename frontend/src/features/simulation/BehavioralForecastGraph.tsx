import React from 'react';
import {
  ComposedChart, Area, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer
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

  // Cyber-Vivid Palette for maximum contrast and aesthetic
  const COLORS = {
    pulse: "#8b5cf6",   // Vivid Violet
    depth: "#06b6d4",   // Electric Cyan
    risk: "#f43f5e",    // Neon Rose
  };

  React.useEffect(() => {
    if (!isSessionValid()) return;

    const fetchData = async () => {
      try {
        let signals = await apiClient(`/trends/signals?view=${view}`);
        if (signals && signals.length) {
          // Fallback: If the backend hasn't reloaded the new SQL query yet, 
          // enforce the 12-month limit on the frontend.
          if (view === 'year' && signals.length > 12) {
            signals = signals.slice(-12);
          }
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
    
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    
    // For 'year' view (Past 12 Months), robustly parse "YYYY-MM" to avoid timezone shifts
    if (view === 'year') {
      const parts = value.split('-');
      if (parts.length >= 2) {
        const yearStr = parts[0].slice(2);
        const monthIndex = parseInt(parts[1], 10) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          return `${months[monthIndex]} '${yearStr}`;
        }
      }
    }
    
    // Fallback for month view ("YYYY-MM-DD")
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
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
        <ComposedChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.pulse} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS.pulse} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.risk} stopOpacity={0.2} />
              <stop offset="95%" stopColor={COLORS.risk} stopOpacity={0} />
            </linearGradient>
            
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 8, fontWeight: 900 }}
            tickFormatter={tickFormatter}
            interval={view === 'year' ? 0 : view === 'day' ? 2 : Math.max(1, Math.floor(data.length / 8))}
          />
          
          <YAxis yAxisId="left" hide domain={[0, 100]} />
          <YAxis yAxisId="right" orientation="right" hide domain={[0, 'auto']} />
          
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} 
          />
          
          {/* 1. Pulse Area (Violet, Left Axis) */}
          <Area 
            yAxisId="left"
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

          {/* 3. Risk Area (Rose, Left Axis) */}
          <Area 
            yAxisId="left"
            name="RISK"
            type="monotone" 
            dataKey="binge" 
            stroke={COLORS.risk} 
            strokeWidth={2} 
            fillOpacity={1} 
            fill="url(#colorRisk)"
            animationDuration={2500} 
          />

          {/* 2. Depth Line (Cyan, Right Axis) */}
          <Line 
            yAxisId="right"
            name="DEPTH"
            type="monotone" 
            dataKey="duration" 
            stroke={COLORS.depth} 
            strokeWidth={3} 
            dot={false}
            activeDot={{ r: 6, fill: COLORS.depth, stroke: '#000', strokeWidth: 2 }}
            animationDuration={2000} 
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Tonal Legend */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-12 mt-8">
        {[
          { label: 'PULSE (%)', color: COLORS.pulse },
          { label: 'DEPTH (MIN)', color: COLORS.depth },
          { label: 'RISK (%)', color: COLORS.risk }
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2 md:gap-3 group/legend cursor-help">
            <div 
              className="h-2 w-2 rounded-full" 
              style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}` }} 
            />
            <span className="text-[8px] md:text-[9px] font-black text-white/50 tracking-[0.4em] uppercase group-hover/legend:text-white transition-colors">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};






export default BehavioralForecastGraph;
