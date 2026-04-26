import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import Sidebar from "../components/layout/Sidebar";
import { Analytics } from "@vercel/analytics/react";

const App: React.FC = () => {
  const [userId, setUserId] = React.useState(localStorage.getItem("netflix_user_id"));

  React.useEffect(() => {
    // Basic polling or event listener for session changes
    const check = () => {
      const current = localStorage.getItem("netflix_user_id");
      if (current !== userId) setUserId(current);
    };
    const inv = setInterval(check, 1000);
    return () => clearInterval(inv);
  }, [userId]);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-black overflow-hidden">
        {userId && <Sidebar />}

        <div className="flex-1 flex flex-col">
          <main className="flex-1">
            <AppRoutes />
          </main>
        </div>
      </div>
      <Analytics />
    </BrowserRouter>
  );
};

export default App;
