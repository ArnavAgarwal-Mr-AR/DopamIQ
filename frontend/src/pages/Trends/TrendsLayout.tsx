import React from "react";
import PageContainer from "../../components/layout/PageContainer";

type Props = {
  children: React.ReactNode;
};

const TrendsLayout: React.FC<Props> = ({ children }) => {
  return <PageContainer>{children}</PageContainer>;
};

export default TrendsLayout;