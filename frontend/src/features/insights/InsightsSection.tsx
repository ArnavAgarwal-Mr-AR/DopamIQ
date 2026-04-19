import React from "react";
import SectionContainer from "../../components/layout/SectionContainer";
import ExplanationBlock from "./ExplanationBlock";
import InsightList from "./InsightList";

type Insight = {
  title: string;
  description: string;
};

type Props = {
  explanation: any;
  insights: Insight[];
};

const InsightsSection: React.FC<Props> = ({
  explanation,
  insights,
}) => {
  return (
    <SectionContainer title="Insights">
      <div className="space-y-4">
        <ExplanationBlock text={explanation} />
        <InsightList insights={insights} />
      </div>
    </SectionContainer>
  );
};

export default InsightsSection;