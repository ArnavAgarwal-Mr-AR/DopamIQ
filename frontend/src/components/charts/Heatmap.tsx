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
  const maxVal = Math.max(...data.map(d => d.value), 1); // Avoid division by zero

  return (
    <div 
      className="grid gap-1" 
      style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}
    >
      {data.map((cell, idx) => {
        const opacity = (cell.value / maxVal).toFixed(2);
        return (
          <div
            key={idx}
            className="aspect-square rounded-[2px] transition-all duration-300 hover:scale-150 hover:shadow-[0_0_10px_rgba(59,130,246,0.8)] relative z-10"
            style={{
              backgroundColor: `rgba(59,130,246, ${Math.max(Number(opacity), 0.03)})`,
            }}
            title={`${cell.x} - ${cell.y}: ${cell.value} sessions`}
          />
        );
      })}
    </div>
  );
};

export default Heatmap;