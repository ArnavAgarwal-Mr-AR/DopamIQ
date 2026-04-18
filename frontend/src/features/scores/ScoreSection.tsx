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
    <SectionContainer title="Behavioral Scores">
      <div className="grid grid-cols-2 gap-4">
        <ScoreRadarChart data={formatted} />
        <ScoreBreakdown scores={formatted} />
      </div>
    </SectionContainer>
  );
};

export default ScoreSection;