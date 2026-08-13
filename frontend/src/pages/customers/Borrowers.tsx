import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { api } from '../../api/axios';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  MoreVertical,
  X,
} from 'lucide-react';

interface Borrower {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  activeLoans: number;
  totalBorrowed: string;
  status: 'Active' | 'Pending' | 'In Default';
}

export const Borrowers = () => {
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    national_id: '',
    gender: '',
    address: '',
    borrower_type: 'INDIVIDUAL',
  });

  const fetchBorrowers = async () => {
    try {
      setLoading(true);

      const response = await api.get('/borrowers');

      const mapped = response.data.map((b: any) => ({
        id: b.id,
        name:
          `${b.first_name || ''} ${b.last_name || ''}`.trim() ||
          b.business_name ||
          'Unnamed Borrower',
        email: b.email || 'N/A',
        phone: b.phone || 'N/A',
        location: b.address || 'N/A',
        activeLoans: b.activeLoans || 0,
        totalBorrowed: b.totalBorrowed || 'UGX 0',
        status: b.status || 'Active',
      }));

      setBorrowers(mapped);
    } catch (err) {
      console.error('Failed to load borrowers:', err);
      setBorrowers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowers();
  }, []);

  const openModal = () => {
    setError('');
    setForm({
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      national_id: '',
      gender: '',
      address: '',
      borrower_type: 'INDIVIDUAL',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (!saving) {
      setIsModalOpen(false);
      setError('');
    }
  };

  const handleCreateBorrower = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.first_name.trim() || !form.last_name.trim() || !form.phone.trim()) {
      setError('First name, last name, and phone number are required.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      await api.post('/borrowers', {
        borrower_type: form.borrower_type,
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        national_id: form.national_id.trim() || null,
        gender: form.gender || null,
        address: form.address.trim() || null,
      });

      setIsModalOpen(false);
      await fetchBorrowers();
    } catch (err: any) {
      console.error('Failed to create borrower:', err);

      setError(
        err?.response?.data?.detail ||
          'Failed to register borrower. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredBorrowers = borrowers.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm) ||
      b.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">
            Borrowers Management
          </h1>
          <p className="text-sm text-slate-500">
            Manage client profiles, contact records, and loan histories
          </p>
        </div>

        <button
          onClick={openModal}
          className="flex items-center gap-2 bg-[#189AB4] hover:bg-[#05445E] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-colors w-fit"
        >
          <UserPlus size={18} />
          Register New Borrower
        </button>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-[#D4F1F4] text-[#05445E] rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">
              Total Borrowers
            </p>
            <h3 className="text-xl font-bold text-[#05445E]">
              {borrowers.length} Registered
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">
              Active Borrowers
            </p>
            <h3 className="text-xl font-bold text-[#05445E]">
              {borrowers.filter((b) => b.status === 'Active').length} Active
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">
              Pending Verification
            </p>
            <h3 className="text-xl font-bold text-[#05445E]">
              {borrowers.filter((b) => b.status === 'Pending').length} Pending
            </h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, phone, or location..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
          />
        </div>

        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors w-full md:w-auto justify-center">
          <Filter size={16} />
          Filter List
        </button>
      </div>

      {/* Borrowers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-[#05445E]/5 text-[#05445E] uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">Borrower Name</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Location</th>
                <th className="p-4">Active Loans</th>
                <th className="p-4">Total Borrowed</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-8 text-center text-slate-400 font-medium"
                  >
                    Loading borrowers...
                  </td>
                </tr>
              ) : filteredBorrowers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-8 text-center text-slate-400 font-medium"
                  >
                    No borrowers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredBorrowers.map((borrower) => (
                  <tr
                    key={borrower.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="p-4">
                      <Link
                        to={`/borrowers/${borrower.id}`}
                        className="font-bold text-[#05445E] hover:text-[#189AB4] hover:underline transition-colors"
                      >
                        {borrower.name}
                      </Link>
                    </td>

                    <td className="p-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                        <Phone size={13} className="text-[#189AB4]" />
                        {borrower.phone}
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <Mail size={13} />
                        {borrower.email}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <MapPin size={13} className="text-[#189AB4]" />
                        {borrower.location}
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-slate-700">
                      {borrower.activeLoans}
                    </td>

                    <td className="p-4 font-bold text-[#05445E]">
                      {borrower.totalBorrowed}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          borrower.status === 'Active'
                            ? 'bg-teal-50 text-teal-700 border border-teal-200'
                            : borrower.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {borrower.status}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <button className="p-2 hover:bg-slate-100 text-slate-500 rounded-lg transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Borrower Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-5">
              <div>
                <h3 className="text-xl font-bold text-[#05445E]">
                  Register New Borrower
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Create a new borrower profile
                </p>
              </div>

              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600"
                disabled={saving}
              >
                <X size={22} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateBorrower} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    First Name *
                  </label>
                  <input
                    required
                    value={form.first_name}
                    onChange={(e) =>
                      setForm({ ...form, first_name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                    placeholder="First name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    required
                    value={form.last_name}
                    onChange={(e) =>
                      setForm({ ...form, last_name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                    placeholder="Last name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    required
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                    placeholder="+256 700 000000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                    placeholder="borrower@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    National ID
                  </label>
                  <input
                    value={form.national_id}
                    onChange={(e) =>
                      setForm({ ...form, national_id: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                    placeholder="National ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={form.gender}
                    onChange={(e) =>
                      setForm({ ...form, gender: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  >
                    <option value="">Select gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Address / Location
                </label>
                <input
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  placeholder="e.g. Nakawa Market, Kampala"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="w-1/2 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-1/2 py-2.5 bg-[#189AB4] hover:bg-[#05445E] disabled:opacity-60 text-white rounded-xl font-semibold transition-colors"
                >
                  {saving ? 'Registering...' : 'Register Borrower'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
