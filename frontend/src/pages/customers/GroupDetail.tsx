import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, UserPlus, ArrowLeft, Phone, Mail, MapPin, ShieldCheck, DollarSign } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'Leader' | 'Treasurer' | 'Member';
  loanBalance: string;
}

export const GroupDetail = () => {
  const { groupId } = useParams();

  // Simulated initial group state
  const [groupName, setGroupName] = useState('Nakawa Traders SACCO Group');
  const [location, setLocation] = useState('Nakawa Market, Kampala');
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: 'Josephine K.', phone: '+256 772 111222', email: 'josephine@example.com', role: 'Leader', loanBalance: 'UGX 2,500,000' },
    { id: '2', name: 'Sarah Namatovu', phone: '+256 701 333444', email: 'sarah@example.com', role: 'Treasurer', loanBalance: 'UGX 1,800,000' },
    { id: '3', name: 'David Mukasa', phone: '+256 752 555666', email: 'david@example.com', role: 'Member', loanBalance: 'UGX 1,200,000' },
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'Leader' | 'Treasurer' | 'Member'>('Member');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !newMemberPhone) return;

    const newMember: Member = {
      id: Date.now().toString(),
      name: newMemberName,
      phone: newMemberPhone,
      email: newMemberEmail || 'N/A',
      role: newMemberRole,
      loanBalance: 'UGX 0',
    };

    setMembers([...members, newMember]);
    setNewMemberName('');
    setNewMemberPhone('');
    setNewMemberEmail('');
    setNewMemberRole('Member');
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      {/* Back button & Header */}
      <div>
        <Link to="/groups" className="inline-flex items-center gap-2 text-sm font-semibold text-[#189AB4] hover:text-[#05445E] mb-3 transition-colors">
          <ArrowLeft size={16} /> Back to Groups
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#05445E]">{groupName}</h1>
            <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
              <MapPin size={15} className="text-[#189AB4]" /> {location} • ID: {groupId}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#189AB4] hover:bg-[#05445E] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-colors w-fit"
          >
            <UserPlus size={18} />
            Add Group Member
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-[#D4F1F4] text-[#05445E] rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Group Size</p>
            <h3 className="text-xl font-bold text-[#05445E]">{members.length} Active Members</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Total Portfolio</p>
            <h3 className="text-xl font-bold text-[#05445E]">UGX 5,500,000</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Group Status</p>
            <h3 className="text-xl font-bold text-teal-600">Active & Verified</h3>
          </div>
        </div>
      </div>

      {/* Group Members Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-lg text-[#05445E]">Group Roster ({members.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-[#05445E]/5 text-[#05445E] uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">Member Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4">Email</th>
                <th className="p-4">Loan Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-[#05445E]">{member.name}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        member.role === 'Leader'
                          ? 'bg-[#D4F1F4] text-[#05445E]'
                          : member.role === 'Treasurer'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {member.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Phone size={13} className="text-[#189AB4]" />
                      {member.phone}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Mail size={13} />
                      {member.email}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-[#05445E]">{member.loanBalance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xl font-bold text-[#05445E]">Add Member to Group</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Mary Akello"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={newMemberPhone}
                  onChange={(e) => setNewMemberPhone(e.target.value)}
                  placeholder="+256 700 000000"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="member@example.com"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Group Role</label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                >
                  <option value="Member">Member</option>
                  <option value="Treasurer">Treasurer</option>
                  <option value="Leader">Leader</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#189AB4] hover:bg-[#05445E] text-white rounded-xl font-semibold transition-colors"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
