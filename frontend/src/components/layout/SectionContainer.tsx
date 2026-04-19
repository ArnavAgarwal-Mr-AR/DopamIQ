import React from "react";

type Props = {
  title?: string;
  children: React.ReactNode;
};

const SectionContainer: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="w-full space-y-8">
      {title && (
        <div className="flex items-center gap-4">
          <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-gray-500 whitespace-nowrap">
            {title}
          </h2>
          <div className="h-px w-full bg-white/5" />
        </div>
      )}
      {children}
    </div>
  );
};

export default SectionContainer;