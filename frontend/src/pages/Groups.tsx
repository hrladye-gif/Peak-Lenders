import { useState, useEffect } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import * as Lucide from 'lucide-react';
import { Link } from 'react-router-dom';

export const Groups = () => {
  const [showModal, setShowModal] = useState(false);
  
  // 1. Initialize from localStorage
  const [groups, setGroups] = useState(() => {
    const saved = localStorage.getItem('groups');
    return saved ? JSON.parse(saved) : [
      { id: 'GRP-001', name: 'Kampala Market Traders', members: 12, contact: '+256 700000000', status: 'Active' },
    ];
  });

  // 2. Sync to localStorage
  useEffect(() => {
    localStorage.setItem('groups', JSON.stringify(groups));
  }, [groups]);

  const [form, setForm] = useState({ name: '', members: '', code: '+256', phone: '' });

  const handleRegister = () => {
    if (form.name && form.phone) {
      setGroups([...groups, { 
        id: 'GRP-' + Math.floor(Math.random() * 1000), 
        name: form.name, 
        members: parseInt(form.members) || 0, 
        contact: form.code + ' ' + form.phone, 
        status: 'Active' 
      }]);
      setShowModal(false);
      setForm({ name: '', members: '', code: '+256', phone: '' });
    }
  };

  return (
    <div className="flex h-screen bg-[#f8f9f9] text-[#1a2e23]">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6">
          <h1 className="text-xl font-bold">Groups</h1>
          <button onClick={() => setShowModal(true)} className="bg-[#166534] text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
            <Lucide.Plus size={16} /> Add Group
          </button>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-xs uppercase font-bold border-b border-slate-100">
                  <th className="pb-4">Group ID</th>
                  <th className="pb-4">Group Name</th>
                  <th className="pb-4">Members</th>
                  <th className="pb-4">Contact</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((g: any) => (
                  <tr key={g.id} className="border-b border-slate-50">
                    <td className="py-4 font-mono text-xs">{g.id}</td>
                    <td className="py-4 font-bold text-[#166534] hover:underline">
                      <Link
                        to={`/groups/${g.id}`}
                        className="text-blue-600 hover:underline font-bold"
                      >
                        {g.name}
                      </Link>
                    </td>
                    <td className="py-4 text-sm">{g.members}</td>
                    <td className="py-4 text-sm">{g.contact}</td>
                    <td className="py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        {g.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl w-[450px] shadow-xl">
            <h2 className="text-xl font-bold mb-4">Register Group</h2>
            <div className="space-y-4">
              <input onChange={(e) => setForm({...form, name: e.target.value})} type="text" placeholder="Group Name" className="w-full p-3 border border-slate-200 rounded-xl" />
              <input onChange={(e) => setForm({...form, members: e.target.value})} type="number" placeholder="Number of Members" className="w-full p-3 border border-slate-200 rounded-xl" />
              <div className="flex gap-2">
                <select onChange={(e) => setForm({...form, code: e.target.value})} className="p-3 border border-slate-200 rounded-xl bg-transparent">
                  <option>+256</option><option>+254</option><option>+255</option><option>+250</option>
                </select>
                <input onChange={(e) => setForm({...form, phone: e.target.value})} type="text" placeholder="Phone Number" className="flex-1 p-3 border border-slate-200 rounded-xl" />
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2 rounded-full font-bold text-slate-500">Cancel</button>
                <button onClick={handleRegister} className="flex-1 bg-[#166534] text-white py-2 rounded-full font-bold">Register</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
