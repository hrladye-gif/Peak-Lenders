import { useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import * as Lucide from 'lucide-react';

export const Users = () => {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([
    { id: 1, name: 'Alex Omondi', role: 'Admin', email: 'alex@peak.com' },
    { id: 2, name: 'Sarah Kimani', role: 'Loan Officer', email: 'sarah@peak.com' }
  ]);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');

  const handleSave = () => {
    if (newName && newRole) {
      setUsers([...users, { id: Date.now(), name: newName, role: newRole, email: 'new@peak.com' }]);
      setNewName('');
      setNewRole('');
      setShowModal(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f8f9f9] text-[#1a2e23]">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6">
          <h1 className="text-xl font-bold">Users</h1>
          <button onClick={() => setShowModal(true)} className="bg-[#166534] text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
            <Lucide.Plus size={16} /> Add User
          </button>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-xs uppercase font-bold border-b border-slate-100">
                  <th className="pb-4">Name</th>
                  <th className="pb-4">Role</th>
                  <th className="pb-4">Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-slate-50">
                    <td className="py-4 font-bold">{u.name}</td>
                    <td className="py-4 text-sm">{u.role}</td>
                    <td className="py-4 text-sm text-slate-500">{u.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            <div className="space-y-4">
              <input value={newName} onChange={(e) => setNewName(e.target.value)} type="text" placeholder="Full Name" className="w-full p-3 border border-slate-200 rounded-xl" />
              <input value={newRole} onChange={(e) => setNewRole(e.target.value)} type="text" placeholder="Role (e.g. Admin)" className="w-full p-3 border border-slate-200 rounded-xl" />
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2 rounded-full font-bold text-slate-500">Cancel</button>
                <button onClick={handleSave} className="flex-1 bg-[#166534] text-white py-2 rounded-full font-bold">Save User</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
