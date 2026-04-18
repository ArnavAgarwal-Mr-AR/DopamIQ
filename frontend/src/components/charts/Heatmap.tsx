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
  return (
    <div className="grid grid-cols-7 gap-1">
      {data.map((cell, idx) => (
        <div
          key={idx}
          className="w-8 h-8 rounded"
          style={{
            backgroundColor: `rgba(59,130,246, ${cell.value})`,
          }}
          title={`${cell.x} - ${cell.y}: ${cell.value}`}
        />
      ))}
    </div>
  );
};

export default Heatmap;