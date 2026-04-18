import React, { useState } from "react";

const UploadDropzone: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
  };

  return (
    <div className="border-2 border-dashed p-6 text-center">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        className="mt-4 px-4 py-2 bg-black text-white rounded"
        onClick={handleUpload}
      >
        Upload
      </button>
    </div>
  );
};

export default UploadDropzone;