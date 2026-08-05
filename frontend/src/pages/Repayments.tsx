import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";

export const Repayments = () => {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const [repayments, setRepayments] = useState(() => {
    const saved = localStorage.getItem("repayments");
    return saved
      ? JSON.parse(saved)
      : [
          {
            receipt: "RCPT-0001",
            loanNo: "LN-0001",
            borrower: "John Doe",
            phone: "+256700000001",
            currency: "UGX",
            amount: 250000,
            method: "Cash",
            collector: "Sarah",
            branch: "Kampala",
            date: "10 Aug 2026",
            status: "Posted",
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem("repayments", JSON.stringify(repayments));
  }, [repayments]);

  const [form, setForm] = useState({
    loanNo: "",
    borrower: "",
    phone: "",
    currency: "",
    amount: "",
    method: "Cash",
    reference: "",
    collector: "",
    branch: "",
  });

  const filtered = useMemo(() => {
    return repayments.filter((r: any) =>
      Object.values(r)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [repayments, search]);

  const totalCollected = repayments.reduce(
    (a: number, b: any) => a + Number(b.amount),
    0
  );

  const saveRepayment = () => {
    setRepayments([
      {
        receipt: `RCPT-${String(repayments.length + 1).padStart(4, "0")}`,
        loanNo: form.loanNo,
        borrower: form.borrower,
        phone: form.phone,
        currency: form.currency,
        amount: Number(form.amount),
        method: form.method,
        collector: form.collector,
        branch: form.branch,
        date: new Date().toLocaleDateString(),
        status: "Posted",
      },
      ...repayments,
    ]);

    setShowModal(false);

    setForm({
      loanNo: "",
      borrower: "",
      phone: "",
      currency: "",
      amount: "",
      method: "Cash",
      reference: "",
      collector: "",
      branch: "",
    });
  };

  return (
    <div className="flex h-screen bg-slate-50">

      <Sidebar />

      <div className="flex-1 overflow-y-auto p-8">

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-4xl font-black">
              Repayments
            </h1>

            <p className="text-slate-500">
              Receive and manage loan repayments
            </p>

          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2"
          >
            <Lucide.Plus size={18} />
            Receive Payment
          </button>

        </div>

        <div className="grid grid-cols-4 gap-5 mb-8">

          <div className="bg-white rounded-3xl border p-6">
            <p className="text-xs uppercase text-slate-500 font-bold">
              Payments
            </p>
            <h2 className="text-4xl font-black mt-3">
              {repayments.length}
            </h2>
          </div>

          <div className="bg-white rounded-3xl border p-6">
            <p className="text-xs uppercase text-slate-500 font-bold">
              Collected
            </p>
            <h2 className="text-4xl font-black mt-3 text-green-600">
              {totalCollected.toLocaleString()}
            </h2>
          </div>

          <div className="bg-white rounded-3xl border p-6">
            <p className="text-xs uppercase text-slate-500 font-bold">
              Posted
            </p>
            <h2 className="text-4xl font-black mt-3 text-blue-600">
              {repayments.filter((r:any)=>r.status==="Posted").length}
            </h2>
          </div>

          <div className="bg-white rounded-3xl border p-6">
            <p className="text-xs uppercase text-slate-500 font-bold">
              Pending
            </p>
            <h2 className="text-4xl font-black mt-3 text-amber-600">
              {repayments.filter((r:any)=>r.status==="Pending").length}
            </h2>
          </div>

        </div>

        <div className="bg-white rounded-3xl border overflow-hidden">

          <div className="p-6 border-b flex justify-between items-center">

            <h2 className="text-xl font-black">
              Repayment Register
            </h2>

            <div className="relative">

              <Lucide.Search
                size={18}
                className="absolute left-3 top-3 text-slate-400"
              />

              <input
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                placeholder="Search repayment..."
                className="border rounded-xl pl-10 pr-4 py-3 w-80"
              />

            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50 text-xs uppercase text-slate-500">

                <tr>

                  <th className="p-4 text-left">Receipt</th>
                  <th className="p-4 text-left">Loan</th>
                  <th className="p-4 text-left">Borrower</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Method</th>
                  <th className="p-4 text-left">Collector</th>
                  <th className="p-4 text-left">Branch</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Status</th>

                </tr>

              </thead>

              <tbody>

                {filtered.map((r:any)=>(
                  <tr
                    key={r.receipt}
                    className="border-t hover:bg-blue-50"
                  >

                    <td className="p-4 font-mono">{r.receipt}</td>

                    <td className="p-4">{r.loanNo}</td>

                    <td className="p-4">
                      <div className="font-bold text-blue-700">
                        {r.borrower}
                      </div>
                      <div className="text-xs text-slate-500">
                        {r.phone}
                      </div>
                    </td>

                    <td className="p-4 font-bold">
                      {r.currency} {Number(r.amount).toLocaleString()}
                    </td>

                    <td className="p-4">{r.method}</td>

                    <td className="p-4">{r.collector}</td>

                    <td className="p-4">{r.branch}</td>

                    <td className="p-4">{r.date}</td>

                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                        {r.status}
                      </span>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

        {showModal && (

          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-3xl w-[700px] p-8">

              <div className="flex justify-between items-center mb-8">

                <h2 className="text-2xl font-black">
                  Receive Repayment
                </h2>

                <button onClick={()=>setShowModal(false)}>
                  <Lucide.X />
                </button>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <input placeholder="Loan Number" className="input"
                  value={form.loanNo}
                  onChange={(e)=>setForm({...form,loanNo:e.target.value})}
                />

                <input placeholder="Borrower" className="input"
                  value={form.borrower}
                  onChange={(e)=>setForm({...form,borrower:e.target.value})}
                />

                <input placeholder="Phone" className="input"
                  value={form.phone}
                  onChange={(e)=>setForm({...form,phone:e.target.value})}
                />

                <input placeholder="Currency" className="input"
                  value={form.currency}
                  onChange={(e)=>setForm({...form,currency:e.target.value})}
                />

                <input placeholder="Amount" className="input"
                  value={form.amount}
                  onChange={(e)=>setForm({...form,amount:e.target.value})}
                />

                <select
                  className="input"
                  value={form.method}
                  onChange={(e)=>setForm({...form,method:e.target.value})}
                >
                  <option>Cash</option>
                  <option>Mobile Money</option>
                  <option>Bank</option>
                  <option>Cheque</option>
                </select>

                <input placeholder="Collector" className="input"
                  value={form.collector}
                  onChange={(e)=>setForm({...form,collector:e.target.value})}
                />

                <input placeholder="Branch" className="input"
                  value={form.branch}
                  onChange={(e)=>setForm({...form,branch:e.target.value})}
                />

              </div>

              <div className="flex justify-end gap-3 mt-8">

                <button
                  onClick={()=>setShowModal(false)}
                  className="px-6 py-3 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  onClick={saveRepayment}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold"
                >
                  Post Payment
                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
};
