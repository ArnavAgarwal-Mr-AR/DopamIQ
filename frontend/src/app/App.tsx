import React from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./routes";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <Navbar />
          <Routes />
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;