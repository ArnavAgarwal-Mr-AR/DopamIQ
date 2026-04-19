import React from "react";
import SectionContainer from "../../components/layout/SectionContainer";
import Card from "../../components/ui/Card";
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
    <SectionContainer title="The Algorithmic Forecast">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-6">Probability Thresholds</h4>
            <div className="space-y-6">
              <ProbabilityBar label="Engagement Intent" value={click} color="blue" />
              <ProbabilityBar label="Willpower Fatigue" value={abandonment} color="red" />
              <ProbabilityBar label="Retention Loop" value={binge} color="purple" />
            </div>
          </Card>
        </div>

        <Card className="flex flex-col items-center justify-center text-center space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Predicted Attention Span</h4>
          <DurationDisplay minutes={duration} />
          <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Estimated minutes per session</p>
        </Card>
      </div>
    </SectionContainer>
  );
};

export default PredictionSection;