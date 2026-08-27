import React from 'react';
import { FiClock } from 'react-icons/fi';

export default function ComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] space-y-6">
      <div className="flex items-center justify-center w-24 h-24 bg-emerald-50 rounded-full">
        <FiClock className="w-12 h-12 text-emerald-500" />
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800">Coming Soon</h1>
        <p className="mt-2 text-slate-600 max-w-md mx-auto">
          This feature is currently under development. Check back soon for updates!
        </p>
      </div>
    </div>
  );
}
