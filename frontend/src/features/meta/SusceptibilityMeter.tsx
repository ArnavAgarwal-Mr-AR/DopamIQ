import React from "react";

type Props = {
  value: number;
};

const SusceptibilityMeter: React.FC<Props> = ({ value }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-black h-3 rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs mt-2">{value}</span>
    </div>
  );
};

export default SusceptibilityMeter;