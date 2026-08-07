import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { api } from '../../api/axios';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const successMessage = location.state?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });

      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }
      if (response.data?.companyName) {
        localStorage.setItem('companyName', response.data.companyName);
      }

      navigate('/dashboard');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#05445E]/10 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-[#189AB4]/20">
        <h2 className="text-2xl font-bold text-[#05445E] text-center mb-1">Peak-Lenders</h2>
        <p className="text-sm text-slate-500 text-center mb-6">Sign in to your institution account</p>

        {successMessage && (
          <div className="mb-4 p-3 bg-teal-50 border border-teal-200 text-teal-800 text-sm rounded-lg text-center font-medium">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
              placeholder="admin@peaklenders.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#189AB4] hover:bg-[#05445E] text-white font-semibold py-3 rounded-xl transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#189AB4] font-semibold hover:underline">
            Register Company
          </Link>
        </p>
      </div>
    </div>
  );
};
