import React from "react";

type Props = {
  value: number;
};

const DriftIndicator: React.FC<Props> = ({ value }) => {
  let label = "Stable";
  if (value > 50) label = "High Drift";
  else if (value > 20) label = "Moderate Drift";

  return (
    <div className="text-center">
      <div className="text-xl font-semibold">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
};

export default DriftIndicator;