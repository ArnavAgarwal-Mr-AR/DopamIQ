import React from "react";

type Props = {
  label: string;
  value: number;
};

const ProbabilityBar: React.FC<Props> = ({ label, value }) => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-black h-2 rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

export default ProbabilityBar;