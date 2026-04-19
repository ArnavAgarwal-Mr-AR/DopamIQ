import React from "react";

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-screen bg-[#030303] border-r border-white/5 flex flex-col p-8 fixed left-0 top-0">
      <div className="mb-12 flex flex-col items-center">
        <img src="/assets/logo.png" alt="Dopamiq Logo" className="w-24 h-24 mb-4 object-contain" />
        <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-white">DOPAMIQ</h2>
        <div className="h-px w-8 bg-blue-500/30 mt-4" />
      </div>

      <nav className="flex flex-col gap-6 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">
        <a href="/" className="hover:text-white transition-colors flex items-center gap-2 group">
          <span className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-blue-500" />
          The Reflection
        </a>
        <a href="/trends" className="hover:text-white transition-colors flex items-center gap-2 group">
          <span className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-blue-500" />
          The Rhythm
        </a>
        <a href="/simulation" className="hover:text-white transition-colors flex items-center gap-2 group">
          <span className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-blue-500" />
          The Future
        </a>
        <a href="/upload" className="hover:text-white transition-colors flex items-center gap-2 group">
          <span className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-blue-500" />
          The Anchor
        </a>
      </nav>

      <div className="mt-auto pt-8 border-t border-white/5">
        <button 
          onClick={() => { localStorage.clear(); window.location.href = '/upload'; }}
          className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-700 hover:text-red-500 transition-colors w-full text-left flex items-center gap-2 group"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-950 group-hover:bg-red-500" />
          Detach Reflection
        </button>
      </div>
    </div>
  );
};

export default Sidebar;