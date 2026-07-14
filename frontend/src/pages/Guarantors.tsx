import { useState, useEffect } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import * as Lucide from 'lucide-react';

export const Guarantors = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingUid, setEditingUid] = useState<number | null>(null);
  const [guarantors, setGuarantors] = useState(() => {
    const saved = localStorage.getItem('guarantors');
    return saved ? JSON.parse(saved) : [{ uid: 1, name: 'Grace Kyalo', idNo: 'KE-554433', phone: '+254 722000000', occupation: 'Business Owner' }];
  });
  const [form, setForm] = useState({ name: '', idNo: '', phone: '', occupation: '' });

  useEffect(() => {
    localStorage.setItem('guarantors', JSON.stringify(guarantors));
  }, [guarantors]);

  const handleSave = () => {
    if (form.name && form.idNo) {
      if (editingUid) {
        setGuarantors(guarantors.map((g: any) => g.uid === editingUid ? { ...form, uid: editingUid } : g));
      } else {
        setGuarantors([...guarantors, { ...form, uid: Date.now() }]);
      }
      setShowModal(false);
      setForm({ name: '', idNo: '', phone: '', occupation: '' });
      setEditingUid(null);
    }
  };

  const startEdit = (g: any) => {
    setForm(g);
    setEditingUid(g.uid);
    setShowModal(true);
  };

  const deleteGuarantor = (uid: number) => setGuarantors(guarantors.filter((g: any) => g.uid !== uid));

  return (
    <div className="flex h-screen bg-[#f8f9f9] text-[#1a2e23]">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6">
          <h1 className="text-xl font-bold">Guarantors</h1>
          <button onClick={() => { setForm({ name: '', idNo: '', phone: '', occupation: '' }); setEditingUid(null); setShowModal(true); }} className="bg-[#166534] text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
            <Lucide.Plus size={16} /> Add Guarantor
          </button>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-xs uppercase font-bold border-b border-slate-100">
                  <th className="pb-4">Name</th>
                  <th className="pb-4">ID Number</th>
                  <th className="pb-4">Phone</th>
                  <th className="pb-4">Occupation</th>
                  <th className="pb-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {guarantors.map((g: any) => (
                  <tr key={g.uid} className="border-b border-slate-50">
                    <td className="py-4 font-bold">{g.name}</td>
                    <td className="py-4 text-sm">{g.idNo}</td>
                    <td className="py-4 text-sm">{g.phone}</td>
                    <td className="py-4 text-sm">{g.occupation}</td>
                    <td className="py-4 flex gap-3">
                      <button onClick={() => startEdit(g)} className="text-blue-600 font-bold text-xs">Edit</button>
                      <button onClick={() => deleteGuarantor(g.uid)} className="text-red-600 font-bold text-xs">Delete</button>
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
            <h2 className="text-xl font-bold mb-4">{editingUid ? 'Edit Guarantor' : 'Register Guarantor'}</h2>
            <div className="space-y-4">
              <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} type="text" placeholder="Full Name" className="w-full p-3 border border-slate-200 rounded-xl" />
              <input value={form.idNo} onChange={(e) => setForm({...form, idNo: e.target.value})} type="text" placeholder="ID Number" className="w-full p-3 border border-slate-200 rounded-xl" />
              <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} type="text" placeholder="Phone Number" className="w-full p-3 border border-slate-200 rounded-xl" />
              <input value={form.occupation} onChange={(e) => setForm({...form, occupation: e.target.value})} type="text" placeholder="Occupation" className="w-full p-3 border border-slate-200 rounded-xl" />
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2 rounded-full font-bold text-slate-500">Cancel</button>
                <button onClick={handleSave} className="flex-1 bg-[#166534] text-white py-2 rounded-full font-bold">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
