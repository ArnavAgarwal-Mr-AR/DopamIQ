import React from "react";

const Sidebar: React.FC = () => {
  return (
    <div className="w-60 h-screen bg-white shadow flex flex-col p-4">
      <h2 className="text-lg font-semibold mb-6">Menu</h2>

      <nav className="flex flex-col gap-3 text-sm text-gray-600">
        <a href="/" className="hover:text-black">Dashboard</a>
        <a href="/trends" className="hover:text-black">Trends</a>
        <a href="/simulation" className="hover:text-black">Simulation</a>
        <a href="/upload" className="hover:text-black">Upload</a>
      </nav>
    </div>
  );
};

export default Sidebar;