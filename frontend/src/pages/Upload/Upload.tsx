import React from "react";
import UploadDropzone from "./UploadDropzone";

const Upload: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-x-hidden">
      
      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center px-6 py-4 relative">
        <div className="max-w-3xl w-full space-y-6 relative z-10">
          
          {/* Header Section */}
          <div className="space-y-3 flex flex-col items-center text-center">
            <img 
              src="/assets/logo.png" 
              alt="Dopamiq Logo" 
              className="w-12 h-12 object-contain" 
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white italic mb-2">
                Initialize Neural Audit.
              </h1>
              <p className="text-gray-500 text-[11px] md:text-xs font-medium max-w-lg mx-auto leading-relaxed">
                Upload your Netflix ViewingActivity.zip. The heuristic engine will process your temporal data to construct your behavioral signature.
              </p>
            </div>
          </div>

          {/* Dropzone Container */}
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 lg:p-8 shadow-2xl relative">
            {/* Subtle Top Accent */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <div className="mb-4 border-b border-white/5 pb-3 flex justify-between items-end">
              <h3 className="text-[9px] font-black uppercase tracking-[0.5em] text-white/50">
                Data Ingestion Port
              </h3>
              <span className="text-[7px] font-black uppercase tracking-widest text-blue-500/60 border border-blue-500/20 px-2 py-0.5 rounded">
                Awaiting Payload
              </span>
            </div>

            <UploadDropzone />
          </div>

          {/* Protocol Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[9px] text-gray-500 uppercase tracking-[0.2em] font-black border-t border-white/5 pt-6">
            <div className="space-y-1">
              <span className="text-white block">01 // Local Processing</span>
              <p className="normal-case tracking-normal font-medium text-gray-600 text-[9px]">Data is parsed entirely in-memory. Zero persistence.</p>
            </div>
            <div className="space-y-1">
              <span className="text-white block">02 // Deep Mapping</span>
              <p className="normal-case tracking-normal font-medium text-gray-600 text-[9px]">Extracts precise behavioral and temporal signatures.</p>
            </div>
            <div className="space-y-1">
              <span className="text-white block">03 // Open Source</span>
              <p className="normal-case tracking-normal font-medium text-gray-600 text-[9px]">Built for transparency. No paywalls or tracking.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;