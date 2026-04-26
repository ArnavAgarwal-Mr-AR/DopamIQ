import React from "react";
import { useLocation, Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "The Reflection", meta: "Core Analysis" },
    { path: "/trends", label: "The Rhythm", meta: "Macro Trends" },
    { path: "/simulation", label: "The Future", meta: "Forecast Model" },
  ];

  return (
    <div className="w-64 h-screen bg-black border-r border-white/5 flex flex-col p-6 fixed left-0 top-0 overflow-y-auto">
      {/* Header / Logo Area */}
      <div className="mb-14 mt-4 flex flex-col items-center">
        <img src="/assets/logo.png" alt="Dopamiq Logo" className="w-16 h-16 mb-4 object-contain" />
        <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-white italic">DOPAMIQ</h2>
        <div className="h-px w-12 bg-gradient-to-r from-transparent via-white/20 to-transparent mt-4" />
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path}
              to={item.path} 
              className={`relative px-4 py-4 rounded-xl flex flex-col gap-1 transition-all duration-300 group ${
                isActive ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-1/2 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              )}
              
              <div className="flex items-center gap-3">
                <span className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  isActive ? "bg-blue-500" : "bg-white/10 group-hover:bg-white/30"
                }`} />
                <span className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${
                  isActive ? "text-white" : "text-gray-500 group-hover:text-gray-300"
                }`}>
                  {item.label}
                </span>
              </div>
              
              <span className={`text-[8px] font-bold uppercase tracking-widest pl-4 transition-colors ${
                isActive ? "text-blue-500/60" : "text-gray-700"
              }`}>
                // {item.meta}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / System Control */}
      <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
        <div className="flex items-center justify-between px-4">
          <span className="text-[8px] font-black uppercase tracking-widest text-gray-600">Network</span>
          <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
            <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
            Active
          </span>
        </div>
        
        <button 
          onClick={() => { localStorage.clear(); window.location.href = '/upload'; }}
          className="w-full px-4 py-3 rounded-lg text-[9px] font-black uppercase tracking-[0.3em] text-red-900/60 hover:text-red-400 hover:bg-red-500/10 transition-all text-left flex items-center gap-3 group"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-900/40 group-hover:bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0)] group-hover:shadow-[0_0_10px_rgba(239,68,68,0.4)] transition-all" />
          Detach Profile
        </button>
      </div>
    </div>
  );
};

export default Sidebar;