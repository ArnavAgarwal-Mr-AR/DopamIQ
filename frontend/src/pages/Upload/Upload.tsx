import React from "react";
import UploadDropzone from "./UploadDropzone";

const Upload: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-2xl w-full space-y-12 relative z-10 text-center">
        <div className="space-y-4 flex flex-col items-center">
          <img src="/assets/logo.png" alt="Dopamiq Logo" className="w-20 h-20 mb-2 object-contain brightness-110 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent leading-none">
            DOPAMIQ
          </h1>
          <p className="text-gray-500 text-base md:text-lg font-medium tracking-wide max-w-xl mx-auto leading-relaxed h-auto">
            Deep within the servers, a version of you exists that you've never met. It knows your 3 AM silence and your comforts. <span className="text-white">Discover your Dopamiq.</span>
          </p>
        </div>

        <div className="p-1 rounded-[32px] bg-gradient-to-b from-white/10 to-transparent border border-white/10 shadow-3xl backdrop-blur-md">
          <UploadDropzone />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-[11px] text-gray-600 uppercase tracking-[0.2em] font-bold">
          <div className="space-y-3">
            <span className="text-white">Privacy First</span>
            <p className="normal-case tracking-normal font-medium text-gray-500">Your data is processed locally in memory. Nothing leaves your browser.</p>
          </div>
          <div className="space-y-3">
            <span className="text-white">Deep Analysis</span>
            <p className="normal-case tracking-normal font-medium text-gray-500">Our heuristic engines extract behavioral signatures to map your profile.</p>
          </div>
          <div className="space-y-3">
            <span className="text-white">Zero Cost</span>
            <p className="normal-case tracking-normal font-medium text-gray-500">Fulfilling the mission of data transparency, completely free.</p>
          </div>
        </div>
      </div>

      <footer className="absolute bottom-10 text-[10px] text-gray-700 uppercase tracking-[0.5em] font-black">
        Unmasking the platform shadow • DOPAMIQ v2.1.0
      </footer>
    </div>
  );
};

export default Upload;