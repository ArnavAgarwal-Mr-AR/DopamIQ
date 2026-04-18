import React from "react";
import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard/Dashboard";
import Trends from "../pages/Trends/Trends";
import Simulation from "../pages/Simulation/Simulation";
import Upload from "../pages/Upload/Upload";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/trends" element={<Trends />} />
      <Route path="/simulation" element={<Simulation />} />
      <Route path="/upload" element={<Upload />} />
    </Routes>
  );
};

export default AppRoutes;