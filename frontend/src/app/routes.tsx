import React from "react";
import { Routes, Route } from "react-router-dom";

const Dashboard = () => <div>Dashboard</div>;
const Trends = () => <div>Trends</div>;
const Simulation = () => <div>Simulation</div>;
const Upload = () => <div>Upload</div>;

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