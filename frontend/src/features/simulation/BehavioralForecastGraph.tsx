import React from 'react';
import {
  AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';
import { apiClient, isSessionValid } from '../../services/apiClient';

export type ViewMode = 'day' | 'month' | 'year';

type Props = {
  view: ViewMode;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const labels: Record<string, string> = {
      prob: 'ACTIVITY',
      duration: 'AVG DURATION',
      binge: 'BINGE RATE'
    };
    return (
      <div className="bg-black border border-white/10 p-3 rounded-lg shadow-2xl backdrop-blur-xl">
        <p className="text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between gap-4 items-center">
            <span className="text-[9px] font-black uppercase tracking-tighter" style={{ color: entry.color }}>
              {labels[entry.dataKey] || entry.dataKey}
            </span>
            <span className="text-[11px] font-black text-white tabular-nums">
              {entry.dataKey === 'duration'
                ? `${Math.round(entry.value)}m`
                : `${Math.round(entry.value)}%`}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const BehavioralForecastGraph: React.FC<Props> = ({ view }) => {
  const [data, setData] = React.useState<any[]>([]);
  const [isReal, setIsReal] = React.useState(false);

  React.useEffect(() => {
    setData([]);
    setIsReal(false);

    if (!isSessionValid()) return;

    const fetchData = async () => {
      try {
        const signals = await apiClient(`/trends/signals?view=${view}`);
        const hasData = signals && signals.some((s: any) => s.prob > 0 || s.duration > 0);
        if (!hasData) return;

        // Scale duration relative to user's own max so all lines render on the same 0–100 axis
        const maxDuration = Math.max(...signals.map((s: any) => s.duration || 0), 1);
        const scaled = signals.map((s: any) => ({
          ...s,
          duration: Math.round((s.duration / maxDuration) * 100),
        }));

        setData(scaled);
        setIsReal(true);
      } catch {
        // apiClient handles session expiry redirect
      }
    };

    fetchData();
  }, [view]);

  // ── X-axis tick formatter ─────────────────────────────────────
  const tickFormatter = (value: string) => {
    if (view === 'day') return `${value}:00`;

    const date = new Date(value);
    if (isNaN(date.getTime())) return value;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (view === 'year') {
      // Monthly points: "Jan 24", "Feb 24"
      return `${months[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;
    }
    // Month view: daily points — "Apr 1", "Apr 2"
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  if (!data.length) {
    return (
      <div className="w-full h-[300px] mt-8 flex items-center justify-center">
        <p className="text-[9px] font-black uppercase tracking-widest text-gray-700">
          {view === 'month' ? 'No activity in the last 30 days' : 'Loading...'}
        </p>
      </div>
    );
  }

  // ── Year view → Area chart with year-boundary markers ────────
  if (view === 'year') {
    // Find label indices where a new year starts (for ReferenceLine markers)
    const yearBoundaries = data.reduce((acc: { index: number; year: string }[], d, i) => {
      const year = new Date(d.label).getFullYear().toString();
      if (i === 0 || year !== new Date(data[i - 1].label).getFullYear().toString()) {
        acc.push({ index: i, year });
      }
      return acc;
    }, []);

    return (
      <div className="w-full h-[300px] mt-8 relative group">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        {isReal && (
          <div className="absolute top-2 right-2 text-[7px] font-black uppercase tracking-widest text-green-500/40">
            Live Data
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorYearProb" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorYearDuration" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorYearBinge" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#f97316" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#4b5563', fontSize: 9, fontWeight: 900 }}
              tickFormatter={tickFormatter}
              interval={Math.max(1, Math.floor(data.length / 10))}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.07)', strokeWidth: 1 }} />

            {/* Year boundary reference lines */}
            {yearBoundaries.map(({ index, year }) => (
              index > 0 && (
                <ReferenceLine
                  key={year}
                  x={data[index]?.label}
                  stroke="rgba(255,255,255,0.08)"
                  strokeDasharray="4 4"
                  label={{ value: year, position: 'insideTopRight', fill: '#374151', fontSize: 8, fontWeight: 900 }}
                />
              )
            ))}

            <Area type="monotone" dataKey="prob"     stroke="#f59e0b" strokeWidth={2}   fillOpacity={1} fill="url(#colorYearProb)"     animationDuration={2000} />
            <Area type="monotone" dataKey="duration" stroke="#10b981" strokeWidth={2}   strokeDasharray="5 5" fillOpacity={1} fill="url(#colorYearDuration)" animationDuration={2500} />
            <Area type="monotone" dataKey="binge"    stroke="#f97316" strokeWidth={1.5} fillOpacity={1} fill="url(#colorYearBinge)"    animationDuration={3000} />
          </AreaChart>
        </ResponsiveContainer>

        <div className="flex justify-center gap-6 mt-10 opacity-50 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
            <span className="text-[8px] font-black uppercase tracking-widest text-white">Activity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
            <span className="text-[8px] font-black uppercase tracking-widest text-white">Duration</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]" />
            <span className="text-[8px] font-black uppercase tracking-widest text-white">Binge Risk</span>
          </div>
        </div>
      </div>
    );
  }

  // ── Day / Month view → Area chart ────────────────────────────
  return (
    <div className="w-full h-[300px] mt-8 relative group">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      {isReal && (
        <div className="absolute top-2 right-2 text-[7px] font-black uppercase tracking-widest text-green-500/40">
          Live Data
        </div>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorBinge" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#4b5563', fontSize: 9, fontWeight: 900 }}
            tickFormatter={tickFormatter}
            interval={view === 'day' ? 2 : Math.max(1, Math.floor(data.length / 7))}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
          <Area type="monotone" dataKey="prob"     stroke="#f59e0b" strokeWidth={2}   fillOpacity={1} fill="url(#colorProb)"     animationDuration={2000} />
          <Area type="monotone" dataKey="duration" stroke="#10b981" strokeWidth={2}   strokeDasharray="5 5" fillOpacity={1} fill="url(#colorDuration)" animationDuration={2500} />
          <Area type="monotone" dataKey="binge"    stroke="#f97316" strokeWidth={1.5} fillOpacity={1} fill="url(#colorBinge)"    animationDuration={3000} />
        </AreaChart>
      </ResponsiveContainer>

      {/* Time Region Markers — Day only */}
      {view === 'day' && (
        <div className="absolute inset-x-0 -bottom-4 flex justify-between px-10 pointer-events-none opacity-30">
          <span className="text-[7px] font-black uppercase tracking-widest text-gray-500">Dawn</span>
          <span className="text-[7px] font-black uppercase tracking-widest text-gray-400">Morning</span>
          <span className="text-[7px] font-black uppercase tracking-widest text-gray-400">Afternoon</span>
          <span className="text-[7px] font-black uppercase tracking-widest text-red-500">Evening</span>
        </div>
      )}

      <div className="flex justify-center gap-6 mt-10 opacity-50 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
          <span className="text-[8px] font-black uppercase tracking-widest text-white">Activity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
          <span className="text-[8px] font-black uppercase tracking-widest text-white">Duration</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]" />
          <span className="text-[8px] font-black uppercase tracking-widest text-white">Binge Risk</span>
        </div>
      </div>
    </div>
  );
};

export default BehavioralForecastGraph;
