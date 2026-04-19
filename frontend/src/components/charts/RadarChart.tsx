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
    <ResponsiveContainer width="100%" height={300}>
      <ReRadarChart data={data} cx="50%" cy="50%" outerRadius="80%">
        <PolarGrid stroke="#ffffff10" />
        <PolarAngleAxis 
          dataKey="subject" 
          tick={{ fill: '#ccc', fontSize: 11, fontWeight: 'bold', tracking: '0.1em' }} 
        />
        <Radar
          name="Personality"
          dataKey="value"
          stroke="#fff"
          strokeWidth={3}
          fill="#3b82f6"
          fillOpacity={0.15}
        />
      </ReRadarChart>
    </ResponsiveContainer>
  );
};

export default RadarChart;