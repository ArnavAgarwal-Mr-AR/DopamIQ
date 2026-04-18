import React from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";

type Props = {
  value: number; // 0–100
  label?: string;
};

const GaugeChart: React.FC<Props> = ({ value, label }) => {
  const data = [{ name: label || "value", value }];

  return (
    <div className="flex flex-col items-center justify-center">
      <ResponsiveContainer width={200} height={200}>
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar
            dataKey="value"
            cornerRadius={10}
          />
        </RadialBarChart>
      </ResponsiveContainer>

      <div className="text-xl font-semibold mt-2">{value}</div>
      {label && <div className="text-sm text-gray-500">{label}</div>}
    </div>
  );
};

export default GaugeChart;