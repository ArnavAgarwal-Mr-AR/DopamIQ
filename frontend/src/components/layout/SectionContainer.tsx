import React from "react";

type Props = {
  title?: string;
  children: React.ReactNode;
};

const SectionContainer: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-4 w-full">
      {title && (
        <h2 className="text-md font-semibold mb-3 text-gray-700">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

export default SectionContainer;