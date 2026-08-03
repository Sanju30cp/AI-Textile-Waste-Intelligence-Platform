import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiBriefcase, FiLogOut, FiArrowLeft } from 'react-icons/fi';

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const userName = localStorage.getItem('userName') || 'User';
  const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
  const userRole = localStorage.getItem('userRole') || 'Textile Manufacturer';
  const userId = localStorage.getItem('userId') || 'N/A';

  const handleLogout = () => {
    setLoading(true);
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-green-50/50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold mb-4 transition-colors"
          >
            <FiArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
          <p className="text-slate-600 mt-2">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xl overflow-hidden">
          {/* Profile Header Background */}
          <div className="h-32 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>

          {/* Profile Content */}
          <div className="px-6 md:px-8 pb-8 pt-8">
            {/* Profile Avatar and Name */}
            <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8 -mt-16 relative">
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg border-4 border-white flex-shrink-0">
                <FiUser className="h-12 w-12" />
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-800">{userName}</h2>
                <p className="text-emerald-600 font-semibold mt-1 uppercase tracking-wide text-sm">
                  {userRole}
                </p>
                <p className="text-slate-500 text-sm mt-2">User ID: {userId}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200 my-8"></div>

            {/* Profile Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Account Information</h3>

              {/* Email */}
              <div>
                <label className="flex items-center gap-3 text-slate-600 font-medium mb-2">
                  <FiMail className="h-5 w-5 text-emerald-600" />
                  Email Address
                </label>
                <div className="ml-8 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800">
                  {userEmail}
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="flex items-center gap-3 text-slate-600 font-medium mb-2">
                  <FiBriefcase className="h-5 w-5 text-emerald-600" />
                  Organization Role
                </label>
                <div className="ml-8 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800">
                  {userRole}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200 my-8"></div>

            {/* Account Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <p className="text-emerald-600 text-xs font-semibold uppercase tracking-wide">Account Status</p>
                <p className="text-slate-800 font-bold text-lg mt-2">Active</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-blue-600 text-xs font-semibold uppercase tracking-wide">Member Since</p>
                <p className="text-slate-800 font-bold text-lg mt-2">2024</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <p className="text-purple-600 text-xs font-semibold uppercase tracking-wide">Access Level</p>
                <p className="text-slate-800 font-bold text-lg mt-2">Full</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => alert('Edit profile functionality coming soon')}
                className="flex-1 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors shadow-md hover:shadow-lg"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 font-semibold rounded-xl hover:bg-rose-100 border border-rose-200 transition-colors disabled:opacity-50"
              >
                <FiLogOut className="h-5 w-5" />
                {loading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
