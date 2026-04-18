import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
    </div>
  );
};

export default Loader;