import React from "react";
import Card from "../../components/ui/Card";

type Props = {
  title: string;
  description: string;
};

const InsightCard: React.FC<Props> = ({ title, description }) => {
  return (
    <Card>
      <h4 className="font-semibold text-sm mb-1">{title}</h4>
      <p className="text-xs text-gray-600">{description}</p>
    </Card>
  );
};

export default InsightCard;