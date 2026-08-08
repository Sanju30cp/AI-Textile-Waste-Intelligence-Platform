import React, { useState } from 'react';
import { FiMoon, FiSun, FiGlobe, FiInfo, FiLogOut, FiChevronRight } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('English');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
        <p className="text-sm text-slate-500">Manage your application preferences and account settings.</p>
      </div>

      <div className="space-y-4">
        
        {/* Theme Settings */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              {theme === 'light' ? <FiSun className="h-6 w-6" /> : <FiMoon className="h-6 w-6" />}
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Application Theme</h3>
              <p className="text-sm text-slate-500">Switch between light and dark mode</p>
            </div>
          </div>
          <select 
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
            <option value="system">System Default</option>
          </select>
        </div>

        {/* Language Settings */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FiGlobe className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Language Preferences</h3>
              <p className="text-sm text-slate-500">Select your primary language</p>
            </div>
          </div>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="English">English</option>
            <option value="Spanish">Español</option>
            <option value="French">Français</option>
          </select>
        </div>

        {/* About Project Link */}
        <Link to="/about" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between hover:border-emerald-200 hover:shadow-sm transition-all cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
              <FiInfo className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">About Project</h3>
              <p className="text-sm text-slate-500">View project documentation, dataset, and developers</p>
            </div>
          </div>
          <FiChevronRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-500" />
        </Link>

        {/* Logout */}
        <div 
          onClick={handleLogout}
          className="rounded-2xl border border-rose-100 bg-white p-6 shadow-xs flex items-center justify-between hover:border-rose-300 hover:bg-rose-50/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-100 transition-colors">
              <FiLogOut className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 group-hover:text-rose-700">Logout</h3>
              <p className="text-sm text-slate-500">Securely sign out of your account</p>
            </div>
          </div>
          <FiChevronRight className="h-5 w-5 text-slate-400 group-hover:text-rose-500" />
        </div>

      </div>

    </div>
  );
}
