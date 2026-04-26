import React from "react";

type Props = {
  result: {
    action: string;
    probability: number;
    duration: number;
    binge: boolean;
  } | null;
};

const SimulationResult: React.FC<Props> = ({ result }) => {
  return null;
};

export default SimulationResult;