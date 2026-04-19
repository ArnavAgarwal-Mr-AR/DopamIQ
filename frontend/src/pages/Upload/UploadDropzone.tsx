import React, { useState } from "react";

const UploadDropzone: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setMessage("Uploading and processing your Zip... This might take a moment.");

    const formData = new FormData();
    formData.append("file", file);

    let userId = localStorage.getItem("netflix_user_id") || crypto.randomUUID();

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
        setMessage("Upload complete! Redirecting to your dashboard...");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        setMessage("Something went wrong during the upload.");
      }
    } catch (error) {
      setMessage("Failed to connect to the server.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8 text-center rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group backdrop-blur-xl">
      <input
        type="file"
        accept=".zip"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-8 block mx-auto text-xs text-gray-400 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border file:border-white/10 file:bg-transparent file:text-white file:font-bold hover:file:bg-white/5 transition-all cursor-pointer"
      />

      <button
        className="px-10 py-3 bg-white text-black font-bold rounded-full hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)]"
        onClick={handleUpload}
        disabled={isUploading || !file}
      >
        {isUploading ? "Exhuming Data..." : "Reveal Your Shadow"}
      </button>

      {message && (
        <div className="mt-8 overflow-hidden">
          <p className={`text-sm font-bold tracking-tight animate-in fade-in slide-in-from-top-2 duration-700 ${message.includes('complete') ? 'text-blue-400' : 'text-gray-400'}`}>
            {message}
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadDropzone;