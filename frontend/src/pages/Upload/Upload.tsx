const Upload: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-2xl w-full space-y-12 relative z-10 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            YOUR DIGITAL SHADOW
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-xl mx-auto">
            Deep within Netflix's servers, a version of you exists that you've never met. It knows your 3 AM silence, your moments of weakness, and your habitual comforts.
          </p>
        </div>

        <div className="p-1 px-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent border border-white/10 shadow-2xl backdrop-blur-sm">
          <UploadDropzone />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-500">
          <div className="space-y-2">
            <span className="text-white font-semibold">Privacy First</span>
            <p>Your data is processed locally in memory. Nothing leaves your browser.</p>
          </div>
          <div className="space-y-2">
            <span className="text-white font-semibold">Deep Analysis</span>
            <p>Our ML models extract 16 behavioral features to map your personality.</p>
          </div>
          <div className="space-y-2">
            <span className="text-white font-semibold">Zero Cost</span>
            <p>Fulfilling the mission of data transparency, completely free.</p>
          </div>
        </div>
      </div>

      <footer className="absolute bottom-8 text-[10px] text-gray-600 uppercase tracking-widest font-bold">
        Unmasking the platform shadow • v2.1.0
      </footer>
    </div>
  );
};

export default Upload;