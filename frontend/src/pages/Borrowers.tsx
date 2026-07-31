import { useState, useEffect } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import * as Lucide from 'lucide-react';

export const Borrowers = () => {
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [borrowers, setBorrowers] = useState(() => {
    const saved = localStorage.getItem('borrowers');
    return saved ? JSON.parse(saved) : [];
  });
  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);
  const [form, setForm] = useState({ 
    name: '', idType: 'National ID', idNo: '', code: '+254', phone: '', 
    address: '', employer: '', yearsEmployed: '', occupation: '', salary: '', 
    guarantorName: '', guarantorPhone: '', guarantorRelationship: '', 
    guarantorIdNo: '', guarantorAddress: '', amount: '0' 
  });

  useEffect(() => {
    localStorage.setItem('borrowers', JSON.stringify(borrowers));
  }, [borrowers]);

  const handleRegister = () => {
    setBorrowers([...borrowers, { ...form, id: 'BRW-' + Math.floor(Math.random() * 1000), status: 'Active' }]);
    setShowModal(false);
    setStep(1);
  };

  const deleteBorrower = (id: string) => setBorrowers(borrowers.filter((b: any) => b.id !== id));

  return (
    <div className="flex h-screen bg-[#f8f9f9] text-[#1a2e23]">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Borrowers</h1>
          <button onClick={() => setShowModal(true)} className="bg-primary text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
            <Lucide.Plus size={16} /> Add Borrower
          </button>
        </header>

        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-xs uppercase font-bold border-b border-slate-100">
                <th className="pb-4">Borrower Name</th>
                <th className="pb-4">Employment</th>
                <th className="pb-4">Contact</th>
                <th className="pb-4">Address</th>
                <th className="pb-4">National ID</th>
                <th className="pb-4">Guarantor</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {borrowers.map((b: any) => (
                <tr key={b.id} className="border-b border-slate-50">
                  <td className="py-4">
                    <p className="font-bold text-sm">{b.name}</p>
                    <p className="text-xs text-slate-500">{b.phone}</p>
                  </td>
                  <td className="py-4">
                    <p className="text-sm font-medium">{b.employer}</p>
                    <p className="text-xs text-slate-500">{b.occupation} • KES {b.salary}</p>
                  </td>
                  <td className="py-4">
                    <p className="text-sm font-medium">{b.guarantorName}</p>
                    <p className="text-xs text-slate-500">{b.guarantorPhone}</p>
                  </td>
                  <td className="py-4">
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                      {b.status}
                    </span>
                  </td>
                  <td className="py-4 flex gap-3">
                    <button className="text-blue-600 font-bold text-xs">Edit</button>
                    <button onClick={() => deleteBorrower(b.id)} className="text-red-600 font-bold text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl w-[500px] shadow-xl">
            <h2 className="text-xl font-bold mb-6">Step {step}: {
              step === 1 ? 'Personal Details' : 
              step === 2 ? 'Documentation' : 
              step === 3 ? 'Guarantors' : 
              step === 4 ? 'Preview Form' : 'Submit'
            }</h2>

            {/* STEP 1: Personal & Employment Details */}
            {step === 1 && (
              <div className="space-y-4">
                <input onChange={(e) => setForm({...form, name: e.target.value})} className="w-full p-3 border rounded-xl" placeholder="Full Name" />
                
                <div className="grid grid-cols-2 gap-4">
                  <input onChange={(e) => setForm({...form, phone: e.target.value})} className="p-3 border rounded-xl" placeholder="Contact Phone" />
                  <input onChange={(e) => setForm({...form, address: e.target.value})} className="p-3 border rounded-xl" placeholder="Physical Address" />
                </div>

                <input onChange={(e) => setForm({...form, employer: e.target.value})} className="w-full p-3 border rounded-xl" placeholder="Employer Name" />
                
                <div className="grid grid-cols-3 gap-4">
                  <input onChange={(e) => setForm({...form, yearsEmployed: e.target.value})} className="p-3 border rounded-xl col-span-1" placeholder="Years" />
                  <input onChange={(e) => setForm({...form, occupation: e.target.value})} className="p-3 border rounded-xl col-span-2" placeholder="Occupation" />
                </div>

                <input onChange={(e) => setForm({...form, salary: e.target.value})} className="w-full p-3 border rounded-xl" placeholder="Monthly Salary (KES)" />

                <button onClick={handleNext} className="w-full bg-primary text-white py-3 rounded-xl font-bold mt-4">Next</button>
              </div>
            )}

            {/* STEP 2: Documentation */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Front ID Upload */}
                  <div className="border-2 border-dashed border-slate-200 p-6 rounded-2xl text-center">
                    <input 
                      type="file" 
                      id="frontId" 
                      className="hidden" 
                      onChange={(e) => console.log("File selected:", e.target.files?.[0]?.name)} 
                    />
                    <label htmlFor="frontId" className="cursor-pointer flex flex-col items-center text-[#166534]">
                      <Lucide.Upload size={24} />
                      <span className="text-xs font-bold mt-2">Front of ID</span>
                    </label>
                  </div>

                  {/* Back ID Upload */}
                  <div className="border-2 border-dashed border-slate-200 p-6 rounded-2xl text-center">
                    <input 
                      type="file" 
                      id="backId" 
                      className="hidden" 
                      onChange={(e) => console.log("File selected:", e.target.files?.[0]?.name)} 
                    />
                    <label htmlFor="backId" className="cursor-pointer flex flex-col items-center text-[#166534]">
                      <Lucide.Upload size={24} />
                      <span className="text-xs font-bold mt-2">Back of ID</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button onClick={handleBack} className="flex-1 py-3 font-bold text-slate-500">Back</button>
                  <button onClick={handleNext} className="flex-1 bg-primary text-white py-3 rounded-xl font-bold">Next</button>
                </div>
              </div>
            )}

            {/* STEP 3: Guarantor Information */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    onChange={(e) => setForm({...form, guarantorName: e.target.value})} 
                    className="p-3 border rounded-xl" placeholder="Full Name" 
                  />
                  <input 
                    onChange={(e) => setForm({...form, guarantorRelationship: e.target.value})} 
                    className="p-3 border rounded-xl" placeholder="Relationship" 
                  />
                </div>
                
                <input 
                  onChange={(e) => setForm({...form, guarantorPhone: e.target.value})} 
                  className="w-full p-3 border rounded-xl" placeholder="Phone Number" 
                />
                <input 
                  onChange={(e) => setForm({...form, guarantorIdNo: e.target.value})} 
                  className="w-full p-3 border rounded-xl" placeholder="National ID Number" 
                />
                <input 
                  onChange={(e) => setForm({...form, guarantorAddress: e.target.value})} 
                  className="w-full p-3 border rounded-xl" placeholder="Physical Address" 
                />

                <div className="flex gap-3 mt-6">
                  <button onClick={handleBack} className="flex-1 py-3 font-bold text-slate-500">Back</button>
                  <button onClick={handleNext} className="flex-1 bg-primary text-white py-3 rounded-xl font-bold">Next</button>
                </div>
              </div>
            )}

            {/* STEP 4: Preview Form */}
            {step === 4 && (
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-400 uppercase">Personal & Employment</h3>
                  <div className="bg-slate-50 p-4 rounded-xl text-sm grid grid-cols-2 gap-y-2">
                    <p><span className="text-slate-500">Name:</span> {form.name}</p>
                    <p><span className="text-slate-500">Phone:</span> {form.phone}</p>
                    <p><span className="text-slate-500">Employer:</span> {form.employer}</p>
                    <p><span className="text-slate-500">Salary:</span> KES {form.salary}</p>
                    <p className="col-span-2"><span className="text-slate-500">Address:</span> {form.address}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-400 uppercase">Guarantor Details</h3>
                  <div className="bg-slate-50 p-4 rounded-xl text-sm grid grid-cols-2 gap-y-2">
                    <p><span className="text-slate-500">Name:</span> {form.guarantorName}</p>
                    <p><span className="text-slate-500">Relation:</span> {form.guarantorRelationship}</p>
                    <p><span className="text-slate-500">Phone:</span> {form.guarantorPhone}</p>
                    <p><span className="text-slate-500">ID:</span> {form.guarantorIdNo}</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={handleBack} className="flex-1 py-3 font-bold text-slate-500">Back</button>
                  <button onClick={handleNext} className="flex-1 bg-primary text-white py-3 rounded-xl font-bold">Confirm & Submit</button>
                </div>
              </div>
            )}

            {/* STEP 5: Success/Finish */}
            {step === 5 && (
              <div className="text-center py-6">
                <Lucide.CheckCircle className="mx-auto text-green-600 mb-4" size={48} />
                <p className="font-bold">Borrower Successfully Registered!</p>
                <button onClick={() => {setShowModal(false); setStep(1);}} className="mt-6 w-full bg-primary text-white py-3 rounded-xl font-bold">Done</button>
              </div>
            )}
          </div>
        </div>
      )}
          </div>
        </div>
      </div>
  );
};
