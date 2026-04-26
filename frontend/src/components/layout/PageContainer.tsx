import React from "react";

type Props = {
  children: React.ReactNode;
};

const PageContainer: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black ml-0 md:ml-64 p-6 md:p-12 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-blue-900/10 blur-[100px] md:blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-purple-900/5 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;