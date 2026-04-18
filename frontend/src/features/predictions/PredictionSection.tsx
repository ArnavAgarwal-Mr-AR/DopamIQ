import React from "react";
import SectionContainer from "../../components/layout/SectionContainer";
import PredictionCard from "./PredictionCard";
import ProbabilityBar from "./ProbabilityBar";
import DurationDisplay from "./DurationDisplay";

type Props = {
  click: number;
  abandonment: number;
  binge: number;
  duration: number;
};

const PredictionSection: React.FC<Props> = ({
  click,
  abandonment,
  binge,
  duration,
}) => {
  return (
    <SectionContainer title="Predictions">
      <div className="grid grid-cols-2 gap-4">
        <PredictionCard title="Probabilities">
          <div className="space-y-3">
            <ProbabilityBar label="Click" value={click} />
            <ProbabilityBar label="Abandonment" value={abandonment} />
            <ProbabilityBar label="Binge" value={binge} />
          </div>
        </PredictionCard>

        <PredictionCard title="Session Duration">
          <DurationDisplay minutes={duration} />
        </PredictionCard>
      </div>
    </SectionContainer>
  );
};

export default PredictionSection;