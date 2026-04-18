import React from "react";
import PageContainer from "../../components/layout/PageContainer";
import GridLayout from "../../components/layout/GridLayout";

type Props = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<Props> = ({ children }) => {
  return (
    <PageContainer>
      <GridLayout columns={1}>{children}</GridLayout>
    </PageContainer>
  );
};

export default DashboardLayout;