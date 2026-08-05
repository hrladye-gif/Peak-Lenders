import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";

export const Applications = () => {
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const borrowers = useMemo(() => {
    const saved = localStorage.getItem("borrowers");
    return saved ? JSON.parse(saved) : [];
  }, []);

  const [query, setQuery] = useState("");

  const matches = borrowers.filter((b:any)=>{

    const search=[
      b.id,
      b.borrowerNo,
      b.firstName,
      b.lastName,
      b.name,
      b.phone,
      b.nationalId,
      b.businessName
    ]
    .join(" ")
    .toLowerCase();

    return search.includes(query.toLowerCase());

  });

  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem("loan-applications");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "loan-applications",
      JSON.stringify(applications)
    );
  }, [applications]);

  const [form, setForm] = useState({
    borrower: "",
    phone: "",
    branch: "",
    product: "",
    currency: "",
    amount: "",
    purpose: "",
    interest: "",
    term: "",
    frequency: "Monthly",
    income: "",
    expenses: "",
    documents: [] as File[],
  });

  const installment = useMemo(() => {
    const amount = Number(form.amount || 0);
    const rate = Number(form.interest || 0) / 100;
    const term = Number(form.term || 1);
    if (!amount || !term) return 0;
    return ((amount * (1 + rate)) / term).toFixed(2);
  }, [form.amount, form.interest, form.term]);

  const submitApplication = () => {
    setApplications([
      {
        id: "APP-" + Date.now().toString().slice(-6),
        borrower: form.borrower,
        phone: form.phone,
        branch: form.branch,
        product: form.product,
        amount: form.amount,
        currency: form.currency,
        purpose: form.purpose,
        interest: form.interest,
        term: form.term,
        status: "Pending",
        score: Math.floor(Math.random() * 200) + 600,
        date: new Date().toLocaleDateString(),
      },
      ...applications,
    ]);

    setShowModal(false);
    setStep(1);

    setForm({
      borrower: "",
      phone: "",
      branch: "",
      product: "",
      currency: "",
      amount: "",
      purpose: "",
      interest: "",
      term: "",
      frequency: "Monthly",
      income: "",
      expenses: "",
      documents: [],
    });
  };

  const Stat = ({
    title,
    value,
    icon,
  }: {
    title: string;
    value: any;
    icon: any;
  }) => (
    <div className="bg-white rounded-3xl border border-blue-100 p-6 shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs uppercase text-slate-500 font-bold">
            {title}
          </p>
          <h2 className="text-4xl font-black mt-3">{value}</h2>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 overflow-y-auto p-8">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black">Loan Applications</h1>
            <p className="text-slate-500">
              Review and process loan requests
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2"
          >
            <Lucide.Plus size={18} />
            New Application
          </button>
        </div>

        <div className="grid grid-cols-5 gap-5 mb-8">
          <Stat
            title="Applications"
            value={applications.length}
            icon={<Lucide.FileText />}
          />
          <Stat
            title="Pending"
            value={applications.filter((x: any) => x.status === "Pending").length}
            icon={<Lucide.Clock3 />}
          />
          <Stat
            title="Approved"
            value={applications.filter((x: any) => x.status === "Approved").length}
            icon={<Lucide.CheckCircle />}
          />
          <Stat
            title="Rejected"
            value={applications.filter((x: any) => x.status === "Rejected").length}
            icon={<Lucide.XCircle />}
          />
          <Stat
            title="Portfolio"
            value={applications.reduce(
              (a: number, b: any) => a + Number(b.amount || 0),
              0
            )}
            icon={<Lucide.Banknote />}
          />
        </div>

        <div className="bg-white rounded-3xl border overflow-hidden">

          <div className="px-6 py-5 border-b">
            <h2 className="font-black text-xl">Applications</h2>
          </div>

          <table className="w-full">
            <thead className="bg-slate-50 text-xs uppercase">
              <tr>
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Borrower</th>
                <th className="p-4 text-left">Product</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Score</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((a: any) => (
                <tr key={a.id} className="border-t hover:bg-blue-50">
                  <td className="p-4 font-mono">{a.id}</td>
                  <td className="p-4">{a.borrower}</td>
                  <td className="p-4">{a.product}</td>
                  <td className="p-4 font-bold">
                    {a.currency} {a.amount}
                  </td>
                  <td className="p-4">{a.score}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white rounded-3xl w-[900px] max-h-[90vh] overflow-y-auto p-8">

              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black">
                  New Loan Application
                </h2>

                <button onClick={() => setShowModal(false)}>
                  <Lucide.X />
                </button>
              </div>

              <div className="flex justify-between mb-10">
                {[
                  "Borrower",
                  "Loan",
                  "Assessment",
                  "Documents",
                  "Review",
                ].map((s, i) => (
                  <div key={s} className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                        step >= i + 1
                          ? "bg-blue-600 text-white"
                          : "bg-slate-200"
                      }`}
                    >
                      {i + 1}
                    </div>

                    <span className="text-xs mt-2">{s}</span>
                  </div>
                ))}
              </div>

              {step === 1 && (
                <div className="space-y-5">

                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search borrower..."
                    className="w-full border rounded-xl p-3"
                  />

                  {query !== "" && (
                    <div className="border rounded-xl max-h-60 overflow-y-auto">
                      {matches.map((b: any) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => {
                            const name =
                              b.name ??
                              `${b.firstName ?? ""} ${b.lastName ?? ""}`;

                            setForm({
                              ...form,
                              borrower:name,
                              phone:b.phone ?? "",
                              branch:b.branch ?? ""
                            });

                            setQuery(name);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b"
                        >
                          <div className="font-bold">{b.name ?? `${b.firstName ?? ""} ${b.lastName ?? ""}`}</div>
                          <div className="text-xs text-slate-500">
                            {b.phone}
                          </div>

                          <div className="text-xs text-blue-600">
                            {b.businessName ?? ""}
                          </div>

                          <div className="text-xs text-slate-400">
                            {b.branch ?? ""}
                          </div>
                        </button>
                      ))}

                      {matches.length === 0 && (
                        <div className="p-4 text-sm text-slate-500">
                          No borrower found.
                        </div>
                      )}
                    </div>
                  )}

                  <input
                    value={form.phone}
                    readOnly
                    className="w-full border rounded-xl p-3 bg-slate-50"
                    placeholder="Phone"
                  />
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-2 gap-5">
                  <input placeholder="Loan Product"
                    className="border rounded-xl p-3"
                    onChange={(e)=>setForm({...form,product:e.target.value})}
                  />

                  <input placeholder="Currency"
                    className="border rounded-xl p-3"
                    onChange={(e)=>setForm({...form,currency:e.target.value})}
                  />

                  <input placeholder="Amount"
                    className="border rounded-xl p-3"
                    onChange={(e)=>setForm({...form,amount:e.target.value})}
                  />

                  <input placeholder="Interest %"
                    className="border rounded-xl p-3"
                    onChange={(e)=>setForm({...form,interest:e.target.value})}
                  />

                  <input placeholder="Term (Months)"
                    className="border rounded-xl p-3"
                    onChange={(e)=>setForm({...form,term:e.target.value})}
                  />

                  <input placeholder="Purpose"
                    className="border rounded-xl p-3"
                    onChange={(e)=>setForm({...form,purpose:e.target.value})}
                  />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <input
                    placeholder="Monthly Income"
                    className="w-full border rounded-xl p-3"
                    onChange={(e)=>setForm({...form,income:e.target.value})}
                  />
                  <input
                    placeholder="Monthly Expenses"
                    className="w-full border rounded-xl p-3"
                    onChange={(e)=>setForm({...form,expenses:e.target.value})}
                  />

                  <div className="bg-blue-50 rounded-2xl p-5">
                    <p className="font-bold">
                      Estimated Installment
                    </p>
                    <h2 className="text-3xl font-black text-blue-600">
                      {installment}
                    </h2>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <input
                    type="file"
                    multiple
                    onChange={(e)=>{
                      if(e.target.files){
                        setForm({
                          ...form,
                          documents:Array.from(e.target.files)
                        });
                      }
                    }}
                  />

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {form.documents.map((f,index)=>(
                      <div
                        key={index}
                        className="border rounded-xl p-4 flex items-center gap-3"
                      >
                        <Lucide.FileText />
                        {f.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-5">
                  <div className="bg-slate-50 rounded-2xl p-6">
                    <p><strong>Borrower:</strong> {form.borrower}</p>
                    <p><strong>Amount:</strong> {form.currency} {form.amount}</p>
                    <p><strong>Purpose:</strong> {form.purpose}</p>
                    <p><strong>Installment:</strong> {installment}</p>
                    <p><strong>Documents:</strong> {form.documents.length}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-10">

                <button
                  onClick={() => step === 1 ? setShowModal(false) : setStep(step-1)}
                  className="px-6 py-3 rounded-xl border font-bold"
                >
                  Back
                </button>

                {step < 5 ? (
                  <button
                    onClick={() => setStep(step+1)}
                    className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={submitApplication}
                    className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold"
                  >
                    Submit Application
                  </button>
                )}

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
