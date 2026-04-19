import React from "react";
import PageContainer from "../../components/layout/PageContainer";
import GridLayout from "../../components/layout/GridLayout";

const TrendsLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <PageContainer>
      <GridLayout columns={1}>
        {children}
      </GridLayout>
    </PageContainer>
  );
};

export default TrendsLayout;