import React from "react";

type Score = {
  subject: string;
  value: number;
};

type Props = {
  scores: Score[];
};

const ScoreBreakdown: React.FC<Props> = ({ scores }) => {
  return (
    <div className="space-y-2">
      {scores.map((s, idx) => (
        <div key={idx} className="flex justify-between text-sm">
          <span>{s.subject}</span>
          <span>{s.value}</span>
        </div>
      ))}
    </div>
  );
};

export default ScoreBreakdown;