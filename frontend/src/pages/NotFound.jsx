import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-tr from-emerald-50 via-slate-50 to-green-50/50 p-6 text-center">
      <div className="max-w-md rounded-2xl border border-slate-200/60 bg-white p-8 shadow-xl shadow-slate-100/50">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 shadow-md shadow-amber-500/10 mb-6">
          <FiAlertTriangle className="h-8 w-8" />
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-800 sm:text-5xl">
          404
        </h1>
        
        <h2 className="mt-4 text-xl font-bold text-slate-700">
          Page Not Found
        </h2>
        
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          The page you are looking for doesn't exist or has been moved. Verify the URL or head back home to continue.
        </p>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-md shadow-emerald-600/10 hover:bg-emerald-700 active:scale-98 transition-all duration-150 cursor-pointer"
          >
            <FiHome className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 bg-white hover:bg-slate-50 active:scale-98 transition-all duration-150 cursor-pointer"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
