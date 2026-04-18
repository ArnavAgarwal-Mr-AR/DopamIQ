import React from "react";
import {
  RadarChart as ReRadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

type Data = {
  subject: string;
  value: number;
};

type Props = {
  data: Data[];
};

const RadarChart: React.FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReRadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <Radar
          name="Score"
          dataKey="value"
          strokeWidth={2}
          fillOpacity={0.4}
        />
      </ReRadarChart>
    </ResponsiveContainer>
  );
};

export default RadarChart;