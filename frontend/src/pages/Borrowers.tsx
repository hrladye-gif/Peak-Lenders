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
    name: '',
    idType: 'National ID',
    idNo: '',
    code: '+254',
    phone: '',
    address: '',
    employer: '',
    yearsEmployed: '',
    occupation: '',
    salary: '',
    guarantorName: '',
    guarantorPhone: '',
    guarantorRelationship: '',
    guarantorIdNo: '',
    guarantorAddress: '',
    amount: '0',
  });

  useEffect(() => {
    localStorage.setItem('borrowers', JSON.stringify(borrowers));
  }, [borrowers]);

  const handleRegister = () => {
    setBorrowers([
      ...borrowers,
      {
        ...form,
        id: 'BRW-' + Math.floor(Math.random() * 1000),
        status: 'Active',
      },
    ]);
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
            <h1 className="text-2xl font-bold">Borrowers</h1>

            <p className="text-slate-500">Manage all individual borrowers</p>
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
            <h3 className="text-slate-500 text-sm">Total Borrowers</h3>

            <p className="text-3xl font-bold">{borrowers.length}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-slate-500 text-sm">Active Loans</h3>

            <p className="text-3xl font-bold">158</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-slate-500 text-sm">Women</h3>

            <p className="text-3xl font-bold">67%</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-slate-500 text-sm">Average Loan</h3>

            <p className="text-3xl font-bold">KES 84K</p>
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
                    <p className="font-semibold">{b.name}</p>

                    <p className="text-xs text-slate-500">{b.id}</p>
                  </td>

                  <td>
                    <p>{b.employer}</p>

                    <p className="text-xs text-slate-500">{b.occupation}</p>
                  </td>

                  <td>
                    <p>{b.phone}</p>
                  </td>

                  <td>{b.address}</td>

                  <td>{b.idNo}</td>

                  <td>
                    <div>
                      <p>{b.guarantorName}</p>

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
            <div className="bg-white p-8 rounded-3xl w-[900px] max-h-[90vh] overflow-y-auto shadow-xl">
              {/* Stepper */}

              <div className="flex justify-between mb-8">
                {[
                  'Personal',
                  'Documents',
                  'Guarantors',
                  'Preview',
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
                            ? 'bg-primary text-white'
                            : 'bg-slate-200'
                        }`}
                      >
                        {current}
                      </div>

                      <p className="text-xs mt-2">{label}</p>
                    </div>
                  );
                })}
              </div>

              <h2 className="text-xl font-bold mb-6">
                Step {step}:{' '}
                {step === 1
                  ? 'Personal Information'
                  : step === 2
                  ? 'Documentation'
                  : step === 3
                  ? 'Guarantors'
                  : step === 4
                  ? 'Preview Form'
                  : 'Submit'}
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
                    <select className="p-3 border rounded-xl">
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

              {step === 2 && (
                <div className="space-y-6">
                  {/* Identity Documents */}

                  <div>
                    <h3 className="font-semibold text-slate-800">
                      Identity Documents
                    </h3>

                    <p className="text-sm text-slate-500 mb-4">
                      Upload clear copies of the borrower's identification
                      documents.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Front ID */}

                      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 hover:border-primary transition">
                        <input
                          type="file"
                          id="frontId"
                          className="hidden"
                          accept="image/*,.pdf"
                          onChange={(e) =>
                            console.log("Front ID:", e.target.files?.[0]?.name)
                          }
                        />

                        <label
                          htmlFor="frontId"
                          className="cursor-pointer flex flex-col items-center text-center"
                        >
                          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-3">
                            <Lucide.Upload
                              className="text-primary"
                              size={24}
                            />
                          </div>

                          <h4 className="font-semibold">
                            Front of National ID
                          </h4>

                          <p className="text-xs text-slate-500 mt-1">
                            JPG, PNG or PDF
                          </p>
                        </label>
                      </div>

                      {/* Back ID */}

                      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 hover:border-primary transition">
                        <input
                          type="file"
                          id="backId"
                          className="hidden"
                          accept="image/*,.pdf"
                          onChange={(e) =>
                            console.log("Back ID:", e.target.files?.[0]?.name)
                          }
                        />

                        <label
                          htmlFor="backId"
                          className="cursor-pointer flex flex-col items-center text-center"
                        >
                          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-3">
                            <Lucide.Upload
                              className="text-primary"
                              size={24}
                            />
                          </div>

                          <h4 className="font-semibold">
                            Back of National ID
                          </h4>

                          <p className="text-xs text-slate-500 mt-1">
                            JPG, PNG or PDF
                          </p>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Additional Documents */}

                  <div>
                    <h3 className="font-semibold text-slate-800">
                      Supporting Documents
                    </h3>

                    <p className="text-sm text-slate-500 mb-4">
                      Upload optional documents for verification.
                    </p>

                    <div className="grid grid-cols-3 gap-4">
                      {[
                        "Passport Photo",
                        "Proof of Residence",
                        "Employment Letter",
                      ].map((doc) => (
                        <div
                          key={doc}
                          className="border border-slate-200 rounded-2xl p-5 text-center hover:border-primary hover:bg-blue-50 transition"
                        >
                          <Lucide.FileText
                            className="mx-auto text-primary mb-3"
                            size={26}
                          />

                          <p className="font-medium text-sm">{doc}</p>

                          <label className="mt-3 inline-block cursor-pointer text-primary text-sm font-semibold">
                            Upload
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*,.pdf"
                            />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Notes
                    </label>

                    <textarea
                      rows={4}
                      placeholder="Any remarks regarding verification..."
                      className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none"
                    />
                  </div>
            
                {/* Navigation */}
            
                <div className="flex justify-between pt-4 border-t border-slate-200">
            
                  <button
                    onClick={handleBack}
                    className="px-6 py-3 rounded-xl border border-slate-300 font-semibold hover:bg-slate-50"
                  >
                    ← Back
                  </button>
            
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90"
                  >
                    Continue →
                  </button>
            
                </div>
            
              </div>
            )}
            {/* STEP 3: Guarantors & Next of Kin */}

            {step === 3 && (
            
              <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-2">
            
                {/* Guarantor */}
            
                <div>
            
                  <h3 className="font-semibold text-slate-800">
                    Primary Guarantor
                  </h3>
            
                  <p className="text-sm text-slate-500 mb-4">
                    Every borrower should have at least one guarantor.
                  </p>
            
                  <div className="grid grid-cols-2 gap-4">
            
                    <input
                      placeholder="Full Name"
                      className="p-3 border rounded-xl"
                      onChange={(e) =>
                        setForm({
                          ...form,
                          guarantorName: e.target.value,
                        })
                      }
                    />
            
                    <input
                      placeholder="Relationship"
                      className="p-3 border rounded-xl"
                      onChange={(e) =>
                        setForm({
                          ...form,
                          guarantorRelationship: e.target.value,
                        })
                      }
                    />
            
                  </div>
            
                  <div className="grid grid-cols-2 gap-4 mt-4">
            
                    <input
                      placeholder="Phone Number"
                      className="p-3 border rounded-xl"
                      onChange={(e) =>
                        setForm({
                          ...form,
                          guarantorPhone: e.target.value,
                        })
                      }
                    />
            
                    <input
                      placeholder="National ID Number"
                      className="p-3 border rounded-xl"
                      onChange={(e) =>
                        setForm({
                          ...form,
                          guarantorIdNo: e.target.value,
                        })
                      }
                    />
            
                  </div>
            
                  <textarea
                    rows={2}
                    placeholder="Physical Address"
                    className="w-full mt-4 p-3 border rounded-xl resize-none"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        guarantorAddress: e.target.value,
                      })
                    }
                  />
            
                </div>
            
                {/* Next of Kin */}
            
                <div className="border-t pt-6">
            
                  <h3 className="font-semibold text-slate-800">
                    Next of Kin
                  </h3>
            
                  <p className="text-sm text-slate-500 mb-4">
                    Person to contact in case of emergency.
                  </p>
            
                  <div className="grid grid-cols-2 gap-4">
            
                    <input
                      placeholder="Full Name"
                      className="p-3 border rounded-xl"
                    />
            
                    <input
                      placeholder="Relationship"
                      className="p-3 border rounded-xl"
                    />
            
                  </div>
            
                  <div className="grid grid-cols-2 gap-4 mt-4">
            
                    <input
                      placeholder="Phone Number"
                      className="p-3 border rounded-xl"
                    />
            
                    <input
                      placeholder="National ID Number"
                      className="p-3 border rounded-xl"
                    />
            
                  </div>
            
                  <textarea
                    rows={2}
                    placeholder="Physical Address"
                    className="w-full mt-4 p-3 border rounded-xl resize-none"
                  />
            
                </div>
            
                {/* Additional Guarantors */}
            
                <div className="border rounded-2xl p-5 bg-slate-50">
            
                  <div className="flex items-center justify-between">
            
                    <div>
            
                      <h4 className="font-semibold">
                        Additional Guarantors
                      </h4>
            
                      <p className="text-sm text-slate-500">
                        Add another guarantor if required by the loan product.
                      </p>
            
                    </div>
            
                    <button
                      type="button"
                      className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2"
                    >
                      <Lucide.Plus size={16} />
                      Add Guarantor
                    </button>
            
                  </div>
            
                </div>
            
                {/* Navigation */}
            
                <div className="flex justify-between pt-6 border-t">
            
                  <button
                    onClick={handleBack}
                    className="px-6 py-3 rounded-xl border border-slate-300 font-semibold hover:bg-slate-50"
                  >
                    ← Back
                  </button>
            
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 rounded-xl bg-primary text-white font-semibold"
                  >
                    Continue →
                  </button>
            
                </div>
            
              </div>
            
            )}

            {/* STEP 4: Preview & Confirm */}
            {step === 4 && (
              <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-2">
            
                {/* Personal Information */}
                <div className="bg-slate-50 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Lucide.User size={18} className="text-primary" />
                      Personal Information
                    </h3>
            
                    <button
                      onClick={() => setStep(1)}
                      className="text-primary text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>
            
                  <div className="grid grid-cols-2 gap-y-3 text-sm">
            
                    <p>
                      <span className="text-slate-500">Full Name</span>
                      <br />
                      <strong>{form.name || "-"}</strong>
                    </p>
            
                    <p>
                      <span className="text-slate-500">Gender</span>
                      <br />
                      <strong>{form.gender || "-"}</strong>
                    </p>
            
                    <p>
                      <span className="text-slate-500">Date of Birth</span>
                      <br />
                      <strong>{form.dob || "-"}</strong>
                    </p>
            
                    <p>
                      <span className="text-slate-500">Phone</span>
                      <br />
                      <strong>{form.phone || "-"}</strong>
                    </p>
            
                    <p>
                      <span className="text-slate-500">Email</span>
                      <br />
                      <strong>{form.email || "-"}</strong>
                    </p>
            
                    <p>
                      <span className="text-slate-500">National ID</span>
                      <br />
                      <strong>{form.idNo || "-"}</strong>
                    </p>
            
                    <p className="col-span-2">
                      <span className="text-slate-500">Address</span>
                      <br />
                      <strong>{form.address || "-"}</strong>
                    </p>
            
                  </div>
                </div>
            
                {/* Employment */}
                <div className="bg-slate-50 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
            
                    <h3 className="font-semibold flex items-center gap-2">
                      <Lucide.Briefcase size={18} className="text-primary" />
                      Employment Information
                    </h3>
            
                    <button
                      onClick={() => setStep(1)}
                      className="text-primary text-sm font-medium"
                    >
                      Edit
                    </button>
            
                  </div>
            
                  <div className="grid grid-cols-2 gap-y-3 text-sm">
            
                    <p>
                      <span className="text-slate-500">Employer</span>
                      <br />
                      <strong>{form.employer || "-"}</strong>
                    </p>
            
                    <p>
                      <span className="text-slate-500">Occupation</span>
                      <br />
                      <strong>{form.occupation || "-"}</strong>
                    </p>
            
                    <p>
                      <span className="text-slate-500">Years Employed</span>
                      <br />
                      <strong>{form.yearsEmployed || "-"}</strong>
                    </p>
            
                    <p>
                      <span className="text-slate-500">Monthly Salary</span>
                      <br />
                      <strong>KES {form.salary || "0"}</strong>
                    </p>
            
                  </div>
                </div>
            
                {/* Documentation */}
                <div className="bg-slate-50 rounded-2xl p-5">
            
                  <div className="flex items-center justify-between mb-4">
            
                    <h3 className="font-semibold flex items-center gap-2">
                      <Lucide.FileCheck size={18} className="text-primary" />
                      Documentation
                    </h3>
            
                    <button
                      onClick={() => setStep(2)}
                      className="text-primary text-sm font-medium"
                    >
                      Edit
                    </button>
            
                  </div>
            
                  <div className="space-y-2 text-sm">
            
                    <div className="flex justify-between">
                      <span>Front ID</span>
                      <span className="text-emerald-600 font-semibold">
                        Uploaded
                      </span>
                    </div>
            
                    <div className="flex justify-between">
                      <span>Back ID</span>
                      <span className="text-emerald-600 font-semibold">
                        Uploaded
                      </span>
                    </div>
            
                    <div className="flex justify-between">
                      <span>Passport Photo</span>
                      <span className="text-emerald-600 font-semibold">
                        Uploaded
                      </span>
                    </div>
            
                  </div>
            
                </div>
            
                {/* Guarantor */}
                <div className="bg-slate-50 rounded-2xl p-5">
            
                  <div className="flex items-center justify-between mb-4">
            
                    <h3 className="font-semibold flex items-center gap-2">
                      <Lucide.Users size={18} className="text-primary" />
                      Guarantor
                    </h3>
            
                    <button
                      onClick={() => setStep(3)}
                      className="text-primary text-sm font-medium"
                    >
                      Edit
                    </button>
            
                  </div>
            
                  <div className="grid grid-cols-2 gap-y-3 text-sm">
            
                    <p>
                      <span className="text-slate-500">Full Name</span>
                      <br />
                      <strong>{form.guarantorName || "-"}</strong>
                    </p>
            
                    <p>
                      <span className="text-slate-500">Relationship</span>
                      <br />
                      <strong>{form.guarantorRelationship || "-"}</strong>
                    </p>
            
                    <p>
                      <span className="text-slate-500">Phone</span>
                      <br />
                      <strong>{form.guarantorPhone || "-"}</strong>
                    </p>
            
                    <p>
                      <span className="text-slate-500">National ID</span>
                      <br />
                      <strong>{form.guarantorIdNo || "-"}</strong>
                    </p>
            
                    <p className="col-span-2">
                      <span className="text-slate-500">Address</span>
                      <br />
                      <strong>{form.guarantorAddress || "-"}</strong>
                    </p>
            
                  </div>
            
                </div>
            
                {/* Declaration */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
            
                  <Lucide.ShieldCheck
                    className="text-primary mt-1"
                    size={20}
                  />
            
                  <p className="text-sm text-slate-700">
                    I confirm that the information entered is accurate and all
                    supporting documents have been verified before creating this
                    borrower.
                  </p>
            
                </div>
            
                {/* Footer */}
                <div className="flex gap-3 pt-2">
            
                  <button
                    onClick={handleBack}
                    className="flex-1 border border-slate-200 py-3 rounded-xl font-semibold hover:bg-slate-50"
                  >
                    Back
                  </button>
            
                  <button
                    onClick={handleRegister}
                    className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold"
                  >
                    Create Borrower
                  </button>
            
                </div>
            
              </div>
            )}

            {/* STEP 5: Success */}
            {step === 5 && (
              <div className="py-8 text-center">
            
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
                  <Lucide.CheckCircle2
                    size={42}
                    className="text-primary"
                  />
                </div>
            
                <h2 className="text-2xl font-bold text-slate-900">
                  Borrower Registered Successfully
                </h2>
            
                <p className="text-slate-500 mt-3 max-w-sm mx-auto">
                  The borrower profile has been created successfully and is now
                  available for loan applications, savings accounts and other
                  transactions.
                </p>
            
                <div className="bg-slate-50 rounded-2xl p-5 mt-8 text-left space-y-3">
            
                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Borrower
                    </span>
            
                    <span className="font-semibold">
                      {form.name}
                    </span>
                  </div>
            
                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Phone
                    </span>
            
                    <span className="font-semibold">
                      {form.phone}
                    </span>
                  </div>
            
                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Employer
                    </span>
            
                    <span className="font-semibold">
                      {form.employer}
                    </span>
                  </div>
            
                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Guarantor
                    </span>
            
                    <span className="font-semibold">
                      {form.guarantorName || "-"}
                    </span>
                  </div>
            
                </div>
            
                <div className="grid grid-cols-2 gap-4 mt-8">
            
                  <button
                    onClick={() => {
                      handleRegister();
                      setShowModal(false);
                      setStep(1);
                    }}
                    className="py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition"
                  >
                    Finish
                  </button>
            
                  <button
                    onClick={() => {
                      handleRegister();
                      setStep(1);
                    }}
                    className="py-3 rounded-xl border border-slate-200 font-semibold hover:bg-slate-50 transition"
                  >
                    Register Another
                  </button>
            
                </div>
            
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
