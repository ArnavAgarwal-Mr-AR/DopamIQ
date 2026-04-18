import React from "react";
import RadarChart from "../../components/charts/RadarChart";

type Score = {
  subject: string;
  value: number;
};

type Props = {
  data: Score[];
};

const ScoreRadarChart: React.FC<Props> = ({ data }) => {
  return <RadarChart data={data} />;
};

export default ScoreRadarChart;