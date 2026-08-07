import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/axios';
import { Users2, Plus, MapPin } from 'lucide-react';

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

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const response = await api.get('/groups');
        setGroups(response.data);
      } catch (err) {
        setGroups([
          { id: '1', name: 'Nakawa Traders SACCO Group', leader: 'Josephine K.', membersCount: 18, location: 'Nakawa Market', totalGroupLoans: 'UGX 15,000,000', status: 'Active' },
          { id: '2', name: 'Wandegeya Women Farmers', leader: 'Mary A.', membersCount: 12, location: 'Wandegeya', totalGroupLoans: 'UGX 8,500,000', status: 'Active' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">Borrower Groups</h1>
          <p className="text-sm text-slate-500">Manage SACCOs, solidarity groups, and joint liability clusters</p>
        </div>
        <button className="flex items-center gap-2 bg-[#189AB4] hover:bg-[#05445E] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-colors">
          <Plus size={18} />
          Create New Group
        </button>
      </div>

      {/* Groups List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-slate-400 col-span-3">Loading groups...</p>
        ) : (
          groups.map((group) => (
            <div key={group.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-[#189AB4] hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-[#D4F1F4] text-[#05445E] rounded-xl">
                  <Users2 size={22} />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                  {group.status}
                </span>
              </div>

              <div>
                {/* Clickable Group Name */}
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
                  <span className="font-semibold text-slate-700">{group.leader}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Total Members</span>
                  <span className="font-semibold text-slate-700">{group.membersCount} Members</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center text-xs">
                <span className="text-slate-500">Group Portfolio</span>
                <span className="font-bold text-[#05445E]">{group.totalGroupLoans}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
