import React from "react";
import Card from "../../components/ui/Card";

type Props = {
  title: string;
  children: React.ReactNode;
};

const MetaCard: React.FC<Props> = ({ title, children }) => {
  return (
    <Card>
      <h4 className="text-sm font-semibold mb-2">{title}</h4>
      {children}
    </Card>
  );
};

export default MetaCard;