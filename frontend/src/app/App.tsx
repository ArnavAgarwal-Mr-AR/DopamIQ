import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

const App: React.FC = () => {
  const userId = localStorage.getItem("netflix_user_id");

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-50">
        {userId && <Sidebar />}

        <div className="flex-1 flex flex-col">
          {userId && <Navbar />}
          <main className="flex-1">
            <AppRoutes />
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;