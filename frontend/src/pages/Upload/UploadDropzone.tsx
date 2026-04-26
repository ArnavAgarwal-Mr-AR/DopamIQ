import React, { useState } from "react";

const UploadDropzone: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setMessage("Exhuming data remains... Initializing analysis.");

    const formData = new FormData();
    formData.append("file", file);

    const userId = localStorage.getItem("netflix_user_id") || crypto.randomUUID();

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "X-User-ID": userId,
        },
        body: formData,
      });

      if (response.ok) {
        localStorage.setItem("netflix_user_id", userId);
        localStorage.setItem("netflix_uploaded_at", Date.now().toString());
        setMessage("Signature extracted. Initializing visualization dashboard...");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        setMessage("Anomaly detected. Protocol rejected.");
      }
    } catch (error) {
      setMessage("Intelligence failure. Check server connection.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="text-center relative">
      <div className="mb-6">
        <label className="cursor-pointer group/label relative inline-block w-full">
          <input
            type="file"
            accept=".zip"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          <div className="w-full h-24 rounded-2xl border border-dashed border-white/20 flex flex-col items-center justify-center group-hover/label:border-blue-500/50 group-hover/label:bg-blue-500/5 transition-all mb-4 bg-white/[0.01]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-20 group-hover/label:opacity-100 transition-opacity mb-2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-500 group-hover/label:text-white transition-colors duration-500">
              {file ? file.name : "Select ViewingActivity.zip"}
            </p>
          </div>
        </label>
      </div>

      <button
        className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.4em] text-[9px] hover:bg-blue-600 hover:text-white hover:scale-[1.01] active:scale-[0.99] disabled:opacity-20 disabled:hover:bg-white disabled:hover:text-black transition-all duration-700 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] rounded-xl"
        onClick={handleUpload}
        disabled={isUploading || !file}
      >
        {isUploading ? "Processing Telemetry..." : "Execute Analysis"}
      </button>

      {message && (
        <div className="mt-6 pt-4 border-t border-white/5">
          <p className={`text-[8px] font-black uppercase tracking-[0.5em] ${message.includes('Signature') ? 'text-blue-400' : 'text-gray-500'} animate-pulse`}>
            {message}
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadDropzone;