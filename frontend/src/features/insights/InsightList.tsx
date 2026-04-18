import React from "react";
import InsightCard from "./InsightCard";

type Insight = {
  title: string;
  description: string;
};

type Props = {
  insights: Insight[];
};

const InsightList: React.FC<Props> = ({ insights }) => {
  return (
    <div className="grid gap-3">
      {insights.map((insight, idx) => (
        <InsightCard
          key={idx}
          title={insight.title}
          description={insight.description}
        />
      ))}
    </div>
  );
};

export default InsightList;