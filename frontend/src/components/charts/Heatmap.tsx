import React from "react";

type HeatmapData = {
  x: string;
  y: string;
  value: number; // raw count
};

type Props = {
  data: HeatmapData[];
};

const Heatmap: React.FC<Props> = ({ data }) => {
  const maxVal = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="w-full max-w-4xl mx-auto p-12 bg-white/[0.01] border border-white/5 rounded-[40px] backdrop-blur-xl relative group">
      <div className="absolute top-0 right-0 p-8 opacity-5 text-[8px] font-black uppercase tracking-[0.5em] pointer-events-none">Density_Matrix_v2</div>
      
      <div className="flex gap-4">
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between py-1 pr-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
            <span key={d} className="text-[7px] font-black text-gray-700 uppercase tracking-widest">{d}</span>
          ))}
        </div>

        <div className="flex-1">
          <div 
            className="grid gap-1.5" 
            style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}
          >
            {data.map((cell, idx) => {
              const weight = cell.value / maxVal;
              return (
                <div
                  key={idx}
                  className="aspect-square rounded-[3px] transition-all duration-500 hover:z-20 hover:scale-[2.5] hover:rotate-12 group/cell relative"
                  style={{
                    backgroundColor: `rgba(96, 165, 250, ${Math.max(weight, 0.04)})`,
                    boxShadow: weight > 0.6 ? `0 0 15px rgba(96, 165, 250, ${weight * 0.3})` : 'none'
                  }}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-[7px] font-black text-white rounded opacity-0 group-hover/cell:opacity-100 whitespace-nowrap pointer-events-none transition-opacity border border-white/10 z-50">
                    {cell.x} // {cell.value} SESSIONS
                  </div>
                </div>
              );
            })}
          </div>

          {/* X-Axis Labels */}
          <div className="flex justify-between mt-6 px-1">
            {["00:00", "06:00", "12:00", "18:00", "23:00"].map(t => (
              <span key={t} className="text-[7px] font-black text-gray-700 uppercase tracking-widest">{t}</span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-12 flex justify-center items-center gap-4 border-t border-white/5 pt-8 opacity-30">
        <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest">Low_Density</span>
        <div className="h-1.5 w-32 rounded-full bg-gradient-to-r from-blue-500/5 to-blue-500" />
        <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest">High_Density</span>
      </div>
    </div>
  );
};


export default Heatmap;