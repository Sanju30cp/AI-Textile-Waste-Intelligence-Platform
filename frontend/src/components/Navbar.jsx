import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiBell, FiSearch, FiUser } from 'react-icons/fi';

export default function Navbar({ onMenuToggle }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Get Page Title from current path
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard Overview';
      case '/upload':
        return 'Upload & Analyze Textile';
      case '/inventory':
        return 'Textile Inventory Log';
      case '/reports':
        return 'Analytics & Reports';
      default:
        return 'Textile Waste Intelligence';
    }
  };

  const userRole = localStorage.getItem('userRole') || 'Administrator';
  const userName = localStorage.getItem('userName') || 'John Doe';

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-xs">
      <div className="flex items-center gap-4">
        {/* Toggle Button for Mobile */}
        <button
          onClick={onMenuToggle}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden"
        >
          <FiMenu className="h-5 w-5" />
        </button>

        {/* Dynamic Title */}
        <h1 className="text-xl font-semibold text-slate-800 hidden sm:block">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right Navbar Controls */}
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative hidden md:block w-64">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <FiSearch className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Notification Bell */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
          <FiBell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-emerald-500"></span>
        </button>

        <div className="h-8 w-px bg-slate-200"></div>

        {/* User Info */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 cursor-pointer hover:opacity-75 transition-opacity"
        >
          <div className="flex flex-col text-right">
            <span className="text-sm font-semibold text-slate-800">{userName}</span>
            <span className="text-[11px] font-medium text-emerald-600 uppercase tracking-wider">{userRole}</span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 text-slate-600 shadow-inner hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-colors">
            <FiUser className="h-5 w-5" />
          </div>
        </button>
      </div>
    </header>
  );
}
