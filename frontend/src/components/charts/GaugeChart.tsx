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
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="relative w-40 h-20">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="80%"
            outerRadius="100%"
            data={[{ value: 100 }]}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar dataKey="value" fill="#ffffff08" cornerRadius={10} isAnimationActive={false} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-x-0 bottom-0 top-0 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="80%"
            outerRadius="100%"
            data={data}
            startAngle={180}
            endAngle={180 - (1.8 * value)}
          >
            <RadialBar
              dataKey="value"
              fill="#fff"
              cornerRadius={10}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        </div>
      </div>

      <div className="text-3xl font-black text-white tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
        {Math.round(value)}
      </div>
    </div>
  );
};

export default GaugeChart;
