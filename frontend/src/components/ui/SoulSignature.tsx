import React from "react";

const SoulSignature: React.FC = () => {
  return (
    <div className="pt-24 pb-12 text-center space-y-4 border-t border-white/5 mt-24">
      <div className="flex justify-center space-x-2 opacity-20">
        <div className="w-1 h-1 bg-white rounded-full" />
        <div className="w-1 h-1 bg-white rounded-full" />
        <div className="w-1 h-1 bg-white rounded-full" />
      </div>
      <p className="text-gray-600 text-[10px] uppercase tracking-[0.5em] font-black">
        Your data is more than a record. It is a legacy of moments.
      </p>
      <p className="text-gray-800 text-[9px] uppercase tracking-widest font-bold opacity-30">
        Behavioral Scoring Engine v2.1 • All rights to your memory reserved.
      </p>
    </div>
  );
};

export default SoulSignature;
