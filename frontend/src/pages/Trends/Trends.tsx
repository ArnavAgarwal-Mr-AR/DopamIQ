import React from "react";
import TrendsLayout from "./TrendsLayout";
import { useTrends } from "../../hooks/useTrends";

import LineChart from "../../components/charts/LineChart";
import Heatmap from "../../components/charts/Heatmap";
import SectionContainer from "../../components/layout/SectionContainer";

const Trends: React.FC = () => {
  const { data, loading } = useTrends();

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data</div>;

  const { score_trends, heatmap } = data;

  const disciplineData = score_trends.map((d: any) => ({
    name: d.date,
    value: d.discipline,
  }));

  const focusData = score_trends.map((d: any) => ({
    name: d.date,
    value: d.focus,
  }));

  return (
    <TrendsLayout>
      <SectionContainer title="Discipline Trend">
        <div className="h-72 w-full">
          <LineChart data={disciplineData} />
        </div>
      </SectionContainer>

      <SectionContainer title="Focus Trend">
        <div className="h-72 w-full">
          <LineChart data={focusData} />
        </div>
      </SectionContainer>

      <SectionContainer title="Usage Heatmap">
        <div className="h-auto w-full flex justify-center py-4">
          <Heatmap data={heatmap} />
        </div>
      </SectionContainer>
    </TrendsLayout>
  );
};

export default Trends;