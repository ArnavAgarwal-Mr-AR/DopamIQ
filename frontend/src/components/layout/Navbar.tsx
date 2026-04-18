import React from "react";

const Navbar: React.FC = () => {
  return (
    <div className="w-full h-14 bg-white shadow flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold">Behavioral Dashboard</h1>

      <div className="flex items-center gap-4">
        <button className="text-sm text-gray-600">Refresh</button>
        <div className="w-8 h-8 rounded-full bg-gray-300" />
      </div>
    </div>
  );
};

export default Navbar;