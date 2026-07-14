import { useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import * as Lucide from 'lucide-react';

export const Tenants = () => {
  const [showModal, setShowModal] = useState(false);
  // 1. Maintain tenant data in state
  const [tenants, setTenants] = useState([
    { id: 1, name: 'Nairobi HQ', country: 'Kenya', status: 'Active' }
  ]);
  
  // 2. Local state for form inputs
  const [newName, setNewName] = useState('');
  const [newCountry, setNewCountry] = useState('');

  // 3. Logic to save and close
  const handleSave = () => {
    if (newName && newCountry) {
      setTenants([...tenants, { id: Date.now(), name: newName, country: newCountry, status: 'Active' }]);
      setNewName('');
      setNewCountry('');
      setShowModal(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f8f9f9] text-[#1a2e23]">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6">
          <h1 className="text-xl font-bold">Tenants</h1>
          <button onClick={() => setShowModal(true)} className="bg-[#166534] text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
            <Lucide.Plus size={16} /> Add Tenant
          </button>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-xs uppercase font-bold border-b border-slate-100">
                  <th className="pb-4">Tenant Name</th>
                  <th className="pb-4">Region</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map(t => (
                  <tr key={t.id} className="border-b border-slate-50">
                    <td className="py-4 font-bold">{t.name}</td>
                    <td className="py-4 text-sm">{t.country}</td>
                    <td className="py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">{t.status}</span></td>
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
            <h2 className="text-xl font-bold mb-4">Add New Tenant</h2>
            <div className="space-y-4">
              <input 
                value={newName} onChange={(e) => setNewName(e.target.value)}
                type="text" placeholder="Tenant Name" className="w-full p-3 border border-slate-200 rounded-xl" 
              />
              <input 
                value={newCountry} onChange={(e) => setNewCountry(e.target.value)}
                type="text" placeholder="Country" className="w-full p-3 border border-slate-200 rounded-xl" 
              />
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2 rounded-full font-bold text-slate-500">Cancel</button>
                <button onClick={handleSave} className="flex-1 bg-[#166534] text-white py-2 rounded-full font-bold">Save Tenant</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};