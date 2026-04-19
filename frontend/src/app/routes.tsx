import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/Dashboard/Dashboard";
import Trends from "../pages/Trends/Trends";
import Simulation from "../pages/Simulation/Simulation";
import Upload from "../pages/Upload/Upload";

const AppRoutes: React.FC = () => {
  const userId = localStorage.getItem("netflix_user_id");

  return (
    <Routes>
      <Route path="/" element={userId ? <Dashboard /> : <Navigate to="/upload" />} />
      <Route path="/trends" element={userId ? <Trends /> : <Navigate to="/upload" />} />
      <Route path="/simulation" element={userId ? <Simulation /> : <Navigate to="/upload" />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="*" element={<Navigate to={userId ? "/" : "/upload"} />} />
    </Routes>
  );
};

export default AppRoutes;