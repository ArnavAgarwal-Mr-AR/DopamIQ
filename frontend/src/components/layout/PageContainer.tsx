import React from "react";

type Props = {
  children: React.ReactNode;
};

const PageContainer: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {children}
    </div>
  );
};

export default PageContainer;