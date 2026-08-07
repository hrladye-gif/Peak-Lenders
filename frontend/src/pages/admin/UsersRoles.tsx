import React, { useState } from 'react';
import { ShieldCheck, UserPlus, Search, Mail, MoreVertical, X } from 'lucide-react';

export const UsersRoles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const users = [
    { id: 'USR-001', name: 'John Opio', email: 'j.opio@peaklenders.com', role: 'Loan Officer', branch: 'Kampala Central', status: 'Active' },
    { id: 'USR-002', name: 'Sarah Akello', email: 's.akello@peaklenders.com', role: 'Branch Manager', branch: 'Jinja Branch', status: 'Active' },
    { id: 'USR-003', name: 'Robert Mulema', email: 'r.mulema@peaklenders.com', role: 'Credit Risk Officer', branch: 'Kampala Central', status: 'Active' },
  ];

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">Users & Permissions</h1>
          <p className="text-sm text-slate-500">Manage system users, access control, and role assignments</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#189AB4] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md hover:bg-[#05445E] transition-colors cursor-pointer"
        >
          <UserPlus size={16} /> Add New User
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search user name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#189AB4] w-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <th className="p-3 font-bold">User Name</th>
                <th className="p-3 font-bold">Role</th>
                <th className="p-3 font-bold">Assigned Branch</th>
                <th className="p-3 font-bold">Status</th>
                <th className="p-3 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3">
                    <p className="font-bold text-slate-800">{u.name}</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1"><Mail size={11} /> {u.email}</p>
                  </td>
                  <td className="p-3 font-medium text-[#05445E]">
                    <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-800 border border-sky-200 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                      <ShieldCheck size={12} /> {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 font-medium">{u.branch}</td>
                  <td className="p-3">
                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-[#05445E] text-base">Add New Staff Member</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Full Name</label>
                <input type="text" placeholder="e.g. David Kato" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Email Address</label>
                <input type="email" placeholder="d.kato@peaklenders.com" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Assign Role</label>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <option>Loan Officer</option>
                  <option>Branch Manager</option>
                  <option>Credit Risk Officer</option>
                  <option>Accountant</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer">Cancel</button>
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-[#189AB4] text-white rounded-xl text-xs font-semibold cursor-pointer">Save User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
