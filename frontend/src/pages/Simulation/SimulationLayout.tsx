import React from "react";
import PageContainer from "../../components/layout/PageContainer";

type Props = {
  children: React.ReactNode;
};

const SimulationLayout: React.FC<Props> = ({ children }) => {
  return <PageContainer>{children}</PageContainer>;
};

export default SimulationLayout;