import React from "react";
import SectionContainer from "../../components/layout/SectionContainer";
import ScoreRadarChart from "./ScoreRadarChart";
import ScoreBreakdown from "./ScoreBreakdown";
import { formatScores } from "./score.utils";

type Props = {
  scores: any;
};

const ScoreSection: React.FC<Props> = ({ scores }) => {
  const formatted = formatScores(scores);

  return (
    <SectionContainer title="The Behavioral Portrait">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 items-center">
        <div className="h-[400px] w-full glass-card p-6 flex items-center justify-center">
          <ScoreRadarChart data={formatted} />
        </div>
        <ScoreBreakdown scores={formatted} />
      </div>
    </SectionContainer>
  );
};

export default ScoreSection;