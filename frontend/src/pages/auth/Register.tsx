import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../api/axios';

export const Register = () => {
  const [companyName, setCompanyName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        company_name: companyName,
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });

      if (response.data?.tenant?.name) {
        localStorage.setItem(
          'companyName',
          response.data.tenant.name
        );
      }

      navigate('/login', {
        state: {
          message:
            'Institution registered successfully! Please log in.',
        },
      });

    } catch (err: any) {
      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(
          detail
            .map((item: any) => item.msg)
            .join(', ')
        );
      } else {
        setError(
          detail ||
          err.response?.data?.message ||
          'Registration failed. Please try again.'
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#05445E]/10 p-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-[#189AB4]/20">

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#05445E]">
            Create Account
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Register your lending institution
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Company / Institution Name
            </label>

            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
              placeholder="Bolt International Limited"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Admin First Name
              </label>

              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                placeholder="Admin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Admin Last Name
              </label>

              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                placeholder="User"
              />
            </div>

          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Admin Email
            </label>

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
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>

            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
              placeholder="Minimum 8 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirm Password
            </label>

            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
              placeholder="Repeat your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#189AB4] hover:bg-[#05445E] text-white font-semibold py-3 rounded-xl transition duration-200 disabled:opacity-50"
          >
            {loading
              ? 'Creating Account...'
              : 'Create Company Account'}
          </button>

        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Already registered?{' '}

          <Link
            to="/login"
            className="text-[#189AB4] font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
};
