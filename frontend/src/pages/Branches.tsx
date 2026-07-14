import { useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import * as Lucide from 'lucide-react';

export const Branches = () => {
  const [showModal, setShowModal] = useState(false);
  const [branches, setBranches] = useState([
    { id: 1, name: 'Nairobi CBD', tenant: 'Nairobi HQ', status: 'Active' },
    { id: 2, name: 'Kampala Main', tenant: 'Uganda Ops', status: 'Active' }
  ]);
  const [newName, setNewName] = useState('');
  const [newTenant, setNewTenant] = useState('');

  const handleSave = () => {
    if (newName && newTenant) {
      setBranches([...branches, { id: Date.now(), name: newName, tenant: newTenant, status: 'Active' }]);
      setNewName('');
      setNewTenant('');
      setShowModal(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f8f9f9] text-[#1a2e23]">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6">
          <h1 className="text-xl font-bold">Branches</h1>
          <button onClick={() => setShowModal(true)} className="bg-[#166534] text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
            <Lucide.Plus size={16} /> Add Branch
          </button>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-xs uppercase font-bold border-b border-slate-100">
                  <th className="pb-4">Branch Name</th>
                  <th className="pb-4">Parent Tenant</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {branches.map(b => (
                  <tr key={b.id} className="border-b border-slate-50">
                    <td className="py-4 font-bold">{b.name}</td>
                    <td className="py-4 text-sm">{b.tenant}</td>
                    <td className="py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">{b.status}</span></td>
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
            <h2 className="text-xl font-bold mb-4">Add New Branch</h2>
            <div className="space-y-4">
              <input value={newName} onChange={(e) => setNewName(e.target.value)} type="text" placeholder="Branch Name" className="w-full p-3 border border-slate-200 rounded-xl" />
              <input value={newTenant} onChange={(e) => setNewTenant(e.target.value)} type="text" placeholder="Parent Tenant" className="w-full p-3 border border-slate-200 rounded-xl" />
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2 rounded-full font-bold text-slate-500">Cancel</button>
                <button onClick={handleSave} className="flex-1 bg-[#166534] text-white py-2 rounded-full font-bold">Save Branch</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
