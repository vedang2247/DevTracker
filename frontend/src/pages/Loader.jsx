import React from 'react';

function Loader() {
  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center">
      {/* The Spinner */}
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-[#818cf8] rounded-full border-t-transparent animate-spin"></div>
      </div>
      
      {/* The Pulsing Branding */}
      <div className="flex items-center gap-2 animate-pulse">
        <div className="bg-[#1f2937] p-1.5 rounded border border-gray-700">
          <span className="text-[#818cf8] font-mono text-xs">&lt;/&gt;</span>
        </div>
        <h2 className="text-lg font-bold text-white tracking-wide">
          Dev<span className="text-[#818cf8]">Tracker</span>
        </h2>
      </div>
    </div>
  );
}

export default Loader;