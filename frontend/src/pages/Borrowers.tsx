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

  const deleteBorrower = (id: string) =>
    setBorrowers(borrowers.filter((b: any) => b.id !== id));
  
  return (
    <div className="flex h-screen bg-[#f8f9f9] text-[#1a2e23]">
      <Sidebar />
  
      <div className="flex-1 p-6 overflow-y-auto">
  
        {/* Header */}
  
        <header className="flex items-center justify-between mb-6">
  
          <div>
  
            <h1 className="text-2xl font-bold">
              Borrowers
            </h1>
  
            <p className="text-slate-500">
              Manage all individual borrowers
            </p>
  
          </div>
  
          <div className="flex gap-3">
  
            <div className="relative">
  
              <Lucide.Search
                size={18}
                className="absolute left-3 top-3 text-slate-400"
              />
  
              <input
                placeholder="Search borrower..."
                className="pl-10 pr-4 py-3 border rounded-xl w-72"
              />
  
            </div>
  
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2"
            >
              <Lucide.Plus size={18} />
              New Borrower
            </button>
  
          </div>
  
        </header>
  
        {/* Statistics */}
  
        <div className="grid grid-cols-4 gap-5 mb-6">
  
          <div className="bg-white rounded-2xl p-5 shadow-sm">
  
            <h3 className="text-slate-500 text-sm">
              Total Borrowers
            </h3>
  
            <p className="text-3xl font-bold">
              {borrowers.length}
            </p>
  
          </div>
  
          <div className="bg-white rounded-2xl p-5 shadow-sm">
  
            <h3 className="text-slate-500 text-sm">
              Active Loans
            </h3>
  
            <p className="text-3xl font-bold">
              158
            </p>
  
          </div>
  
          <div className="bg-white rounded-2xl p-5 shadow-sm">
  
            <h3 className="text-slate-500 text-sm">
              Women
            </h3>
  
            <p className="text-3xl font-bold">
              67%
            </p>
  
          </div>
  
          <div className="bg-white rounded-2xl p-5 shadow-sm">
  
            <h3 className="text-slate-500 text-sm">
              Average Loan
            </h3>
  
            <p className="text-3xl font-bold">
              KES 84K
            </p>
  
          </div>
  
        </div>
  
        {/* Borrowers Table */}
  
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
  
                <tr
                  key={b.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition"
                >
  
                  <td className="py-4">
  
                    <p className="font-semibold">
                      {b.name}
                    </p>
  
                    <p className="text-xs text-slate-500">
                      {b.id}
                    </p>
  
                  </td>
  
                  <td>
  
                    <p>
                      {b.employer}
                    </p>
  
                    <p className="text-xs text-slate-500">
                      {b.occupation}
                    </p>
  
                  </td>
  
                  <td>
  
                    <p>
                      {b.phone}
                    </p>
  
                  </td>
  
                  <td>
  
                    {b.address}
  
                  </td>
  
                  <td>
  
                    {b.idNo}
  
                  </td>
  
                  <td>
  
                    <div>
  
                      <p>
                        {b.guarantorName}
                      </p>
  
                      <p className="text-xs text-slate-500">
                        {b.guarantorPhone}
                      </p>
  
                    </div>
  
                  </td>
  
                  <td>
  
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                      {b.status}
                    </span>
  
                  </td>
  
                  <td>
  
                    <div className="flex gap-3">
  
                      <button className="text-primary">
  
                        <Lucide.Pencil size={16} />
  
                      </button>
  
                      <button
                        onClick={() => deleteBorrower(b.id)}
                        className="text-red-600"
                      >
  
                        <Lucide.Trash2 size={16} />
  
                      </button>
  
                      <button className="text-slate-500">
  
                        <Lucide.Eye size={16} />
  
                      </button>
  
                    </div>
  
                  </td>
  
                </tr>
  
              ))}
  
            </tbody>
  
          </table>
  
        </div>
  
        {/* Modal */}
  
        {showModal && (
  
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  
            <div className="bg-white p-8 rounded-3xl w-[500px] shadow-xl">
  
              {/* Stepper */}
  
              <div className="flex justify-between mb-8">
  
                {[
                  "Personal",
                  "Documents",
                  "Guarantors",
                  "Preview",
                ].map((label, index) => {
  
                  const current = index + 1;
  
                  return (
  
                    <div
                      key={label}
                      className="flex-1 flex flex-col items-center"
                    >
  
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          step >= current
                            ? "bg-primary text-white"
                            : "bg-slate-200"
                        }`}
                      >
  
                        {current}
  
                      </div>
  
                      <p className="text-xs mt-2">
                        {label}
                      </p>
  
                    </div>
  
                  );
  
                })}
  
              </div>
  
              <h2 className="text-xl font-bold mb-6">
                Step {step}:{" "}
                {step === 1
                  ? "Personal Information"
                  : step === 2
                  ? "Documentation"
                  : step === 3
                  ? "Guarantors"
                  : step === 4
                  ? "Preview Form"
                  : "Submit"}
              </h2>

            
           {/* STEP 1: Personal Information */}

            {step === 1 && (
            
              <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-2">
            
                {/* Name */}
            
                <div className="grid grid-cols-3 gap-4">
            
                  <input
                    placeholder="First Name"
                    className="p-3 border rounded-xl"
                  />
            
                  <input
                    placeholder="Middle Name"
                    className="p-3 border rounded-xl"
                  />
            
                  <input
                    placeholder="Last Name"
                    className="p-3 border rounded-xl"
                  />
            
                </div>
            
                {/* Personal Details */}
            
                <div className="grid grid-cols-3 gap-4">
            
                  <select className="p-3 border rounded-xl">
                    <option>Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
            
                  <input
                    type="date"
                    className="p-3 border rounded-xl"
                  />
            
                  <select className="p-3 border rounded-xl">
                    <option>Marital Status</option>
                    <option>Single</option>
                    <option>Married</option>
                    <option>Divorced</option>
                    <option>Widowed</option>
                  </select>
            
                </div>
            
                {/* Nationality */}
            
                <div className="grid grid-cols-2 gap-4">
            
                  <select className="p-3 border rounded-xl">
            
                    <option>Nationality</option>
            
                    <option>Ugandan</option>
                    <option>Kenyan</option>
                    <option>Tanzanian</option>
                    <option>Rwandan</option>
                    <option>Burundian</option>
            
                  </select>
            
                  <select className="p-3 border rounded-xl">
            
                    <option>Branch</option>
            
                    <option>Kampala Main</option>
                    <option>Ntinda</option>
                    <option>Mbarara</option>
            
                  </select>
            
                </div>
            
                {/* Identification */}
            
                <div className="grid grid-cols-2 gap-4">
            
                  <select
                    className="p-3 border rounded-xl"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        idType: e.target.value,
                      })
                    }
                  >
            
                    <option>National ID</option>
                    <option>Passport</option>
                    <option>Driving Permit</option>
            
                  </select>
            
                  <input
                    placeholder="Identification Number"
                    className="p-3 border rounded-xl"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        idNo: e.target.value,
                      })
                    }
                  />
            
                </div>
            
                {/* Contact */}
            
                <div className="grid grid-cols-3 gap-4">
            
                  <select
                    className="p-3 border rounded-xl"
                  >
            
                    <option>+256</option>
                    <option>+254</option>
                    <option>+255</option>
                    <option>+250</option>
                    <option>+257</option>
            
                  </select>
            
                  <input
                    placeholder="Phone Number"
                    className="col-span-2 p-3 border rounded-xl"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        phone: e.target.value,
                      })
                    }
                  />
            
                </div>
            
                <input
                  placeholder="Alternative Phone Number"
                  className="w-full p-3 border rounded-xl"
                />
            
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full p-3 border rounded-xl"
                />
            
                {/* Address */}
            
                <textarea
                  rows={2}
                  placeholder="Physical Address"
                  className="w-full p-3 border rounded-xl resize-none"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      address: e.target.value,
                    })
                  }
                />
            
                <input
                  placeholder="Postal Address (Optional)"
                  className="w-full p-3 border rounded-xl"
                />
            
                {/* Employment */}
            
                <div className="border-t pt-5">
            
                  <h3 className="font-semibold text-slate-700 mb-4">
                    Employment Information
                  </h3>
            
                  <input
                    placeholder="Employer Name"
                    className="w-full p-3 border rounded-xl mb-4"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        employer: e.target.value,
                      })
                    }
                  />
            
                  <div className="grid grid-cols-2 gap-4">
            
                    <input
                      placeholder="Occupation"
                      className="p-3 border rounded-xl"
                      onChange={(e) =>
                        setForm({
                          ...form,
                          occupation: e.target.value,
                        })
                      }
                    />
            
                    <input
                      placeholder="Years Employed"
                      className="p-3 border rounded-xl"
                      onChange={(e) =>
                        setForm({
                          ...form,
                          yearsEmployed: e.target.value,
                        })
                      }
                    />
            
                  </div>
            
                  <div className="grid grid-cols-2 gap-4 mt-4">
            
                    <input
                      placeholder="Monthly Income"
                      className="p-3 border rounded-xl"
                      onChange={(e) =>
                        setForm({
                          ...form,
                          salary: e.target.value,
                        })
                      }
                    />
            
                    <select className="p-3 border rounded-xl">
            
                      <option>Loan Officer</option>
            
                      <option>Andrew Forbist</option>
                      <option>Sarah Namusoke</option>
                      <option>David Kato</option>
            
                    </select>
            
                  </div>
            
                </div>
            
                <button
                  onClick={handleNext}
                  className="w-full bg-primary text-white py-3 rounded-xl font-semibold"
                >
                  Continue to Documentation
                </button>
            
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
                    <label htmlFor="frontId" className="cursor-pointer flex flex-col items-center text-primary">
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
                    <label htmlFor="backId" className="cursor-pointer flex flex-col items-center text-primary">
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
