import React from "react";

type Props = {
  summary: string;
};

const SimulationSummary: React.FC<Props> = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="bg-gray-50 border rounded-xl p-4 text-sm text-gray-700">
      {summary}
    </div>
  );
};

export default SimulationSummary;