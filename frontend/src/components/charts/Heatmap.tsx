import React from "react";

type HeatmapData = {
  x: string;
  y: string;
  value: number; // 0–1
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
            className="w-8 h-8 rounded"
            style={{
              backgroundColor: `rgba(59,130,246, ${Math.max(Number(opacity), 0.1)})`,
            }}
            title={`${cell.x} - ${cell.y}: ${cell.value} sessions`}
          />
        );
      })}
    </div>
  );
};

export default Heatmap;