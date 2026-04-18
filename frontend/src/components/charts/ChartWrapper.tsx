import React from "react";

type Props = {
  title?: string;
  loading?: boolean;
  children: React.ReactNode;
};

const ChartWrapper: React.FC<Props> = ({ title, loading, children }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 w-full h-full">
      {title && (
        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          {title}
        </h3>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-[250px]">
          <span className="text-gray-400">Loading...</span>
        </div>
      ) : (
        <div className="w-full h-[300px]">{children}</div>
      )}
    </div>
  );
};

export default ChartWrapper;