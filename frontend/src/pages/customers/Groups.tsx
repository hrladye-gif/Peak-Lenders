import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/axios';
import { Users2, Plus, MapPin, X } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  leader: string;
  membersCount: number;
  location: string;
  totalGroupLoans: string;
  status: 'Active' | 'Review';
}

export const Groups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const fetchGroups = async () => {
    try {
      setLoading(true);

      const response = await api.get('/groups');

      const mappedGroups = response.data.map((group: any) => {
        const members = group.members || [];

        const leader =
          members.find((member: any) => member.role === 'LEADER')?.borrower;

        const leaderName = leader
          ? `${leader.first_name || ''} ${leader.last_name || ''}`.trim() ||
            leader.business_name ||
            'N/A'
          : 'Not assigned';

        return {
          id: group.id,
          name: group.name,
          leader: leaderName,
          membersCount: members.length,
          location: group.location || 'N/A',
          totalGroupLoans: 'UGX 0',
          status: group.status === 'ACTIVE' ? 'Active' : 'Review',
        };
      });

      setGroups(mappedGroups);
    } catch (err) {
      console.error('Failed to load groups:', err);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const openModal = () => {
    setName('');
    setLocation('');
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (!saving) {
      setIsModalOpen(false);
      setError('');
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Group name is required.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      await api.post('/groups', {
        name: name.trim(),
        location: location.trim() || null,
      });

      setIsModalOpen(false);
      await fetchGroups();
    } catch (err: any) {
      console.error('Failed to create group:', err);

      setError(
        err?.response?.data?.detail ||
          'Failed to create group. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">
            Borrower Groups
          </h1>
          <p className="text-sm text-slate-500">
            Manage SACCOs, solidarity groups, and joint liability clusters
          </p>
        </div>

        <button
          onClick={openModal}
          className="flex items-center gap-2 bg-[#189AB4] hover:bg-[#05445E] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-colors"
        >
          <Plus size={18} />
          Create New Group
        </button>
      </div>

      {/* Groups List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-slate-400 col-span-3">Loading groups...</p>
        ) : groups.length === 0 ? (
          <div className="col-span-3 bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <Users2
              size={40}
              className="mx-auto text-slate-300 mb-3"
            />
            <p className="text-slate-500 font-medium">
              No borrower groups registered yet.
            </p>
          </div>
        ) : (
          groups.map((group) => (
            <div
              key={group.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-[#189AB4] hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 bg-[#D4F1F4] text-[#05445E] rounded-xl">
                  <Users2 size={22} />
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                  {group.status}
                </span>
              </div>

              <div>
                <Link
                  to={`/groups/${group.id}`}
                  className="text-lg font-bold text-[#05445E] hover:text-[#189AB4] transition-colors block"
                >
                  {group.name}
                </Link>

                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin size={13} className="text-[#189AB4]" />
                  {group.location}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block">Group Leader</span>
                  <span className="font-semibold text-slate-700">
                    {group.leader}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block">Total Members</span>
                  <span className="font-semibold text-slate-700">
                    {group.membersCount} Members
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center text-xs">
                <span className="text-slate-500">Group Portfolio</span>
                <span className="font-bold text-[#05445E]">
                  {group.totalGroupLoans}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Group Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-5">
              <div>
                <h3 className="text-xl font-bold text-[#05445E]">
                  Create New Group
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Create a borrower group
                </p>
              </div>

              <button
                onClick={closeModal}
                disabled={saving}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={22} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Group Name *
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Nakawa Traders SACCO Group"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Location
                </label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Nakawa Market, Kampala"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                />
              </div>

              <div className="flex gap-3 pt-3">
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
                  {saving ? 'Creating...' : 'Create Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
