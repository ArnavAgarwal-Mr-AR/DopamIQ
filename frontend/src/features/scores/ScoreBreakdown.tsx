import React from "react";

type Score = {
  subject: string;
  value: number;
};

type Props = {
  scores: Score[];
};

import ScoreCard from "./ScoreCard";

const ScoreBreakdown: React.FC<Props> = ({ scores }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {scores.map((s, idx) => (
        <ScoreCard key={idx} title={s.subject} value={s.value} />
      ))}
    </div>
  );
};

export default ScoreBreakdown;