import React from "react";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Data = {
  name: string;
  value: number;
};

type Props = {
  data: Data[];
};

const LineChart: React.FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReLineChart data={data}>
        <CartesianGrid stroke="#ffffff08" vertical={false} />
        <XAxis 
          dataKey="name" 
          stroke="#444" 
          tick={{ fontSize: 9, fill: '#666' }} 
          axisLine={false}
          tickLine={false}
          dy={10}
        />
        <YAxis 
          domain={[0, 100]} 
          stroke="#444" 
          tick={{ fontSize: 9, fill: '#666' }} 
          axisLine={false}
          tickLine={false}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }} 
          itemStyle={{ color: '#fff', fontWeight: 'bold' }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#fff"
          strokeWidth={4}
          dot={false}
          activeDot={{ r: 6, fill: '#3b82f6', stroke: '#000', strokeWidth: 2 }}
          animationDuration={2000}
        />
      </ReLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;