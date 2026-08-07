import React, { useState, useEffect } from 'react';
import { api } from '../../api/axios';
import { Users, UserPlus, Search, Filter, Phone, Mail, MapPin, MoreVertical } from 'lucide-react';

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

  useEffect(() => {
    const fetchBorrowers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/borrowers');
        setBorrowers(response.data);
      } catch (err) {
        console.warn('Backend API offline, loading default data...');
        setBorrowers([
          { id: '1', name: 'Robert Musoke', email: 'robert@example.com', phone: '+256 772 123456', location: 'Kampala', activeLoans: 2, totalBorrowed: 'UGX 5,000,000', status: 'Active' },
          { id: '2', name: 'Grace Namubiru', email: 'grace@example.com', phone: '+256 701 987654', location: 'Ntinda', activeLoans: 1, totalBorrowed: 'UGX 2,500,000', status: 'Active' },
          { id: '3', name: 'David Ochieng', email: 'david@example.com', phone: '+256 752 456789', location: 'Mbarara', activeLoans: 0, totalBorrowed: 'UGX 1,200,000', status: 'Pending' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowers();
  }, []);

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
          <h1 className="text-3xl font-bold text-[#05445E]">Borrowers Management</h1>
          <p className="text-sm text-slate-500">Manage client profiles, contact records, and loan histories</p>
        </div>
        <button className="flex items-center gap-2 bg-[#189AB4] hover:bg-[#05445E] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-colors w-fit">
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
            <p className="text-xs font-semibold text-slate-400 uppercase">Total Borrowers</p>
            <h3 className="text-xl font-bold text-[#05445E]">{borrowers.length} Registered</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Active Borrowers</p>
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
            <p className="text-xs font-semibold text-slate-400 uppercase">Pending Verification</p>
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
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                    Loading borrowers...
                  </td>
                </tr>
              ) : filteredBorrowers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                    No borrowers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredBorrowers.map((borrower) => (
                  <tr key={borrower.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-[#05445E]">{borrower.name}</td>
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
                    <td className="p-4 font-semibold text-slate-700">{borrower.activeLoans}</td>
                    <td className="p-4 font-bold text-[#05445E]">{borrower.totalBorrowed}</td>
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
    </div>
  );
};
