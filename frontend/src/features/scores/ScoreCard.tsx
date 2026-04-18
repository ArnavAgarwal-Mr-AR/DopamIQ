import React from "react";
import Card from "../../components/ui/Card";

type Props = {
  title: string;
  value: number;
};

const ScoreCard: React.FC<Props> = ({ title, value }) => {
  return (
    <Card>
      <div className="text-xs text-gray-500">{title}</div>
      <div className="text-xl font-semibold">{value}</div>
    </Card>
  );
};

export default ScoreCard;