import React from "react";
import Card from "../../components/ui/Card";

type Props = {
  result: {
    action: string;
    probability: number;
    duration: number;
    binge: boolean;
  } | null;
};

const SimulationResult: React.FC<Props> = ({ result }) => {
  if (!result) return null;

  return (
    <Card>
      <div className="space-y-2 text-sm">
        <div>
          <strong>Action:</strong> {result.action}
        </div>
        <div>
          <strong>Probability:</strong> {Math.round(result.probability * 100)}%
        </div>
        <div>
          <strong>Duration:</strong> {result.duration} mins
        </div>
        <div>
          <strong>Binge:</strong> {result.binge ? "Yes" : "No"}
        </div>
      </div>
    </Card>
  );
};

export default SimulationResult;