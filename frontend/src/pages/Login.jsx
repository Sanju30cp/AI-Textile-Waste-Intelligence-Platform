import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiFeather, FiAlertCircle } from 'react-icons/fi';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/users/login', { email, password });
      
      // Store token and auth state
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userName', response.user.full_name);
      localStorage.setItem('userEmail', response.user.email);
      localStorage.setItem('userId', response.user.id);
      localStorage.setItem('userRole', response.user.role);
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-tr from-emerald-50 via-slate-50 to-green-50/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/60 bg-white p-8 shadow-xl shadow-slate-100/50">
        
        {/* Logo and Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 mb-3">
            <FiFeather className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Textile Waste Intelligence
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Sign in to manage textile classification & circularity
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-xl bg-rose-50 p-4 text-sm text-rose-600 border border-rose-100">
            <FiAlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                <FiMail className="h-5 w-5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-800 outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-slate-700">
                Password
              </label>
              <a 
                href="#forgot" 
                onClick={(e) => { e.preventDefault(); alert('Reset functionality is mocked. Check console.'); }}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                <FiLock className="h-5 w-5" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-800 outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white shadow-md shadow-emerald-600/10 hover:bg-emerald-700 active:scale-98 transition-all duration-150 disabled:bg-emerald-400 disabled:scale-100 flex justify-center items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-slate-600">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Register
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
