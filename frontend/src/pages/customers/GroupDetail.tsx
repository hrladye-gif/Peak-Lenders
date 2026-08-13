import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users,
  UserPlus,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  DollarSign,
  Loader2,
} from 'lucide-react';
import { api } from '../../api/axios';

interface Borrower {
  id: string;
  first_name?: string;
  last_name?: string;
  business_name?: string;
  phone?: string;
  email?: string;
}

interface Member {
  id: string;
  borrower_id: string;
  role: string;
  borrower?: Borrower;
}

interface Group {
  id: string;
  name: string;
  location?: string;
  status: string;
  tenant_id: string;
  branch_id?: string | null;
  members: Member[];
}

export const GroupDetail = () => {
  const { groupId } = useParams<{ groupId: string }>();

  const [group, setGroup] = useState<Group | null>(null);
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingMember, setAddingMember] = useState(false);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBorrowerId, setSelectedBorrowerId] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('MEMBER');

  const fetchGroup = async () => {
    if (!groupId) return;

    try {
      const response = await api.get(`/groups/${groupId}`);
      setGroup(response.data);
    } catch (err) {
      console.error('Failed to load group:', err);
      setError('Failed to load group information.');
    }
  };

  const fetchBorrowers = async () => {
    try {
      const response = await api.get('/borrowers');
      setBorrowers(response.data);
    } catch (err) {
      console.error('Failed to load borrowers:', err);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchGroup(), fetchBorrowers()]);
      setLoading(false);
    };

    load();
  }, [groupId]);

  const getBorrowerName = (borrower?: Borrower) => {
    if (!borrower) return 'Unknown Borrower';

    if (borrower.business_name) {
      return borrower.business_name;
    }

    return `${borrower.first_name || ''} ${borrower.last_name || ''}`.trim();
  };

  const availableBorrowers = borrowers.filter(
    (borrower) =>
      !group?.members.some(
        (member) => member.borrower_id === borrower.id
      )
  );

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupId || !selectedBorrowerId) {
      setError('Please select a borrower.');
      return;
    }

    try {
      setAddingMember(true);
      setError('');

      await api.post(`/groups/${groupId}/members`, {
        borrower_id: selectedBorrowerId,
        role: newMemberRole,
      });

      await fetchGroup();

      setSelectedBorrowerId('');
      setNewMemberRole('MEMBER');
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Failed to add group member:', err);

      setError(
        err?.response?.data?.detail ||
          'Failed to add borrower to the group.'
      );
    } finally {
      setAddingMember(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-slate-50 min-h-screen">
        <p className="text-slate-400">Loading group...</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="p-8 bg-slate-50 min-h-screen">
        <Link
          to="/groups"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#189AB4]"
        >
          <ArrowLeft size={16} />
          Back to Groups
        </Link>

        <p className="mt-6 text-rose-600">
          {error || 'Group not found.'}
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">

      {/* Back + Header */}
      <div>
        <Link
          to="/groups"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#189AB4] hover:text-[#05445E] mb-3 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Groups
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#05445E]">
              {group.name}
            </h1>

            <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
              <MapPin size={15} className="text-[#189AB4]" />
              {group.location || 'No location specified'}
              {' • '}
              ID: {group.id}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setError('');
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#189AB4] hover:bg-[#05445E] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-colors w-fit"
          >
            <UserPlus size={18} />
            Add Group Member
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-[#D4F1F4] text-[#05445E] rounded-xl">
            <Users size={24} />
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">
              Group Size
            </p>

            <h3 className="text-xl font-bold text-[#05445E]">
              {group.members.length} Active Members
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
            <DollarSign size={24} />
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">
              Total Portfolio
            </p>

            <h3 className="text-xl font-bold text-[#05445E]">
              UGX 0
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <ShieldCheck size={24} />
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">
              Group Status
            </p>

            <h3 className="text-xl font-bold text-teal-600">
              {group.status}
            </h3>
          </div>
        </div>

      </div>

      {/* Members */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-lg text-[#05445E]">
            Group Roster ({group.members.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">

            <thead className="bg-[#05445E]/5 text-[#05445E] uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">Member Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4">Email</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {group.members.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-slate-400"
                  >
                    No members in this group yet.
                  </td>
                </tr>
              ) : (
                group.members.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-slate-50 transition-colors"
                  >

                    <td className="p-4">
                      <Link
                        to={`/borrowers/${member.borrower_id}`}
                        className="font-bold text-[#05445E] hover:text-[#189AB4] transition-colors"
                      >
                        {getBorrowerName(member.borrower)}
                      </Link>
                    </td>

                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                        {member.role}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Phone
                          size={13}
                          className="text-[#189AB4]"
                        />
                        {member.borrower?.phone || 'N/A'}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Mail size={13} />
                        {member.borrower?.email || 'N/A'}
                      </div>
                    </td>

                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">

          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-5">

            <div className="flex justify-between items-center border-b border-slate-100 pb-3">

              <h3 className="text-xl font-bold text-[#05445E]">
                Add Member to Group
              </h3>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>

            </div>

            <form onSubmit={handleAddMember} className="space-y-4">

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Select Borrower
                </label>

                <select
                  required
                  value={selectedBorrowerId}
                  onChange={(e) =>
                    setSelectedBorrowerId(e.target.value)
                  }
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                >
                  <option value="">
                    -- Select borrower --
                  </option>

                  {availableBorrowers.map((borrower) => (
                    <option
                      key={borrower.id}
                      value={borrower.id}
                    >
                      {getBorrowerName(borrower)}
                      {borrower.phone
                        ? ` — ${borrower.phone}`
                        : ''}
                    </option>
                  ))}
                </select>

                {availableBorrowers.length === 0 && (
                  <p className="text-xs text-amber-600 mt-2">
                    There are no available borrowers to add.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Group Role
                </label>

                <select
                  value={newMemberRole}
                  onChange={(e) =>
                    setNewMemberRole(e.target.value)
                  }
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                >
                  <option value="MEMBER">Member</option>
                  <option value="TREASURER">Treasurer</option>
                  <option value="LEADER">Leader</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={addingMember}
                  className="w-1/2 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    addingMember ||
                    !selectedBorrowerId ||
                    availableBorrowers.length === 0
                  }
                  className="w-1/2 py-2.5 bg-[#189AB4] hover:bg-[#05445E] text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {addingMember ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Member'
                  )}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
