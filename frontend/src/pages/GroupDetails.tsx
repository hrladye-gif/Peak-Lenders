import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import * as Lucide from 'lucide-react';

export const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingUid, setEditingUid] = useState<number | null>(null);
  
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem(`members-${id}`);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [form, setForm] = useState({ name: '', idNo: '', phone: '', frontId: '', backId: '' });

  useEffect(() => {
    localStorage.setItem(`members-${id}`, JSON.stringify(members));
  }, [members, id]);

  const handleSave = () => {
    if (form.name && form.idNo) {
      if (editingUid) {
        setMembers(members.map((m: any) => m.uid === editingUid ? { ...form, uid: editingUid } : m));
      } else {
        setMembers([...members, { ...form, uid: Date.now() }]);
      }
      setForm({ name: '', idNo: '', phone: '', frontId: '', backId: '' });
      setEditingUid(null);
      setShowModal(false);
    }
  };

  const startEdit = (m: any) => {
    setForm(m);
    setEditingUid(m.uid);
    setShowModal(true);
  };

  const deleteMember = (uid: number) => {
    setMembers(members.filter((m: any) => m.uid !== uid));
  };

  return (
    <div className="flex h-screen bg-[#f8f9f9] text-[#1a2e23]">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full">
              <Lucide.ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">Group {id} Members</h1>
          </div>
          <button 
            onClick={() => { setForm({ name: '', idNo: '', phone: '', frontId: '', backId: '' }); setEditingUid(null); setShowModal(true); }} 
            className="bg-[#166534] text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2"
          >
            <Lucide.Plus size={16} /> Add Member
          </button>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-xs uppercase font-bold border-b border-slate-100">
                  <th className="pb-4">Member Name</th>
                  <th className="pb-4">ID Number</th>
                  <th className="pb-4">Phone</th>
                  <th className="pb-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m: any) => (
                  <tr key={m.uid} className="border-b border-slate-50">
                    <td className="py-4 font-bold">{m.name}</td>
                    <td className="py-4 text-sm">{m.idNo}</td>
                    <td className="py-4 text-sm">{m.phone}</td>
                    <td className="py-4 flex gap-3">
                      <button onClick={() => startEdit(m)} className="text-blue-600 font-bold text-xs">Edit</button>
                      <button onClick={() => deleteMember(m.uid)} className="text-red-600 font-bold text-xs">Delete</button>
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
          <div className="bg-white p-8 rounded-3xl w-[500px] shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingUid ? 'Edit Member' : 'Register New Member'}</h2>
            <div className="space-y-4">
              <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} type="text" placeholder="Full Name" className="w-full p-3 border border-slate-200 rounded-xl" />
              <input value={form.idNo} onChange={(e) => setForm({...form, idNo: e.target.value})} type="text" placeholder="ID Number" className="w-full p-3 border border-slate-200 rounded-xl" />
              <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} type="text" placeholder="Phone" className="w-full p-3 border border-slate-200 rounded-xl" />
              
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2 rounded-full font-bold text-slate-500">Cancel</button>
                <button onClick={handleSave} className="flex-1 bg-[#166534] text-white py-2 rounded-full font-bold">Save Member</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};