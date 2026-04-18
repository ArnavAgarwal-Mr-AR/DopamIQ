import React from "react";

type Props = {
  minutes: number;
};

const DurationDisplay: React.FC<Props> = ({ minutes }) => {
  return (
    <div className="text-center">
      <div className="text-2xl font-semibold">{minutes} min</div>
      <div className="text-xs text-gray-500">Expected Duration</div>
    </div>
  );
};

export default DurationDisplay;