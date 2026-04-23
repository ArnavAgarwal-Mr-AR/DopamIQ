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
        setMessage("Shadow exhumed. Redirecting to your reflection...");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        setMessage("Anomaly detected. Upload failed.");
      }
    } catch (error) {
      setMessage("Intelligence failure. Check server connection.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-12 text-center relative overflow-hidden group">
      <div className="absolute inset-0 bg-white/[0.01] pointer-events-none" />
      
      <div className="mb-10">
        <label className="cursor-pointer group/label relative inline-block">
          <input
            type="file"
            accept=".zip"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          <div className="w-24 h-24 rounded-3xl border-2 border-dashed border-white/10 flex items-center justify-center group-hover/label:border-blue-500/50 transition-all mb-4 mx-auto bg-white/5">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-20 group-hover/label:opacity-100 transition-opacity">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 group-hover/label:text-white transition-colors duration-500">
            {file ? file.name : "Inject ViewingActivity.zip"}
          </p>
        </label>
      </div>

      <button
        className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-[11px] rounded-2xl hover:bg-blue-600 hover:text-white hover:scale-[1.01] active:scale-[0.99] disabled:opacity-20 disabled:hover:bg-white disabled:hover:text-black transition-all duration-700 shadow-2xl"
        onClick={handleUpload}
        disabled={isUploading || !file}
      >
        {isUploading ? "Exhuming Digital Remains..." : "Reveal Your Shadow"}
      </button>

      {message && (
        <div className="mt-10 pt-10 border-t border-white/5">
          <p className={`text-[10px] font-black uppercase tracking-[0.5em] ${message.includes('Shadow') ? 'text-blue-500' : 'text-gray-700'} animate-pulse`}>
            {message}
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadDropzone;