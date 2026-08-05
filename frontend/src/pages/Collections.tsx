import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";

export const Collections = () => {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const [collections, setCollections] = useState(() => {
    const saved = localStorage.getItem("collections");

    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "COL-0001",
            loanNo: "LN-0001",
            borrower: "John Doe",
            phone: "+256700000001",
            branch: "Kampala",
            officer: "Sarah",
            arrears: 450000,
            days: 18,
            action: "Field Visit",
            outcome: "Promise to Pay",
            nextVisit: "15 Aug 2026",
            status: "Pending",
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem(
      "collections",
      JSON.stringify(collections)
    );
  }, [collections]);

  const [form, setForm] = useState({
    loanNo: "",
    borrower: "",
    phone: "",
    branch: "",
    officer: "",
    arrears: "",
    days: "",
    action: "Phone Call",
    outcome: "",
    nextVisit: "",
  });

  const filtered = useMemo(() => {
    return collections.filter((c: any) =>
      Object.values(c)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [collections, search]);

  const totalArrears = collections.reduce(
    (a: number, b: any) => a + Number(b.arrears),
    0
  );

  const saveCollection = () => {
    setCollections([
      {
        id: `COL-${String(collections.length + 1).padStart(4, "0")}`,
        ...form,
        arrears: Number(form.arrears),
        days: Number(form.days),
        status: "Pending",
      },
      ...collections,
    ]);

    setShowModal(false);

    setForm({
      loanNo: "",
      borrower: "",
      phone: "",
      branch: "",
      officer: "",
      arrears: "",
      days: "",
      action: "Phone Call",
      outcome: "",
      nextVisit: "",
    });
  };

  return (
    <div className="flex h-screen bg-slate-50">

      <Sidebar />

      <div className="flex-1 overflow-y-auto p-8">

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-4xl font-black">
              Collections
            </h1>

            <p className="text-slate-500">
              Manage delinquent loans and recovery activities
            </p>

          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex gap-2 items-center"
          >
            <Lucide.Plus size={18} />
            New Collection
          </button>

        </div>

        <div className="grid grid-cols-4 gap-5 mb-8">

          <div className="bg-white rounded-3xl border p-6">
            <p className="text-xs uppercase text-slate-500 font-bold">
              Collection Cases
            </p>
            <h2 className="text-4xl font-black mt-3">
              {collections.length}
            </h2>
          </div>

          <div className="bg-white rounded-3xl border p-6">
            <p className="text-xs uppercase text-slate-500 font-bold">
              Total Arrears
            </p>
            <h2 className="text-4xl font-black mt-3 text-red-600">
              {totalArrears.toLocaleString()}
            </h2>
          </div>

          <div className="bg-white rounded-3xl border p-6">
            <p className="text-xs uppercase text-slate-500 font-bold">
              Promise To Pay
            </p>
            <h2 className="text-4xl font-black mt-3 text-amber-600">
              {
                collections.filter(
                  (c: any) =>
                    c.outcome === "Promise to Pay"
                ).length
              }
            </h2>
          </div>

          <div className="bg-white rounded-3xl border p-6">
            <p className="text-xs uppercase text-slate-500 font-bold">
              Resolved
            </p>
            <h2 className="text-4xl font-black mt-3 text-green-600">
              {
                collections.filter(
                  (c: any) =>
                    c.status === "Resolved"
                ).length
              }
            </h2>
          </div>

        </div>

        <div className="bg-white rounded-3xl border overflow-hidden">

          <div className="p-6 border-b flex justify-between items-center">

            <h2 className="text-xl font-black">
              Collection Register
            </h2>

            <div className="relative">

              <Lucide.Search
                size={18}
                className="absolute left-3 top-3 text-slate-400"
              />

              <input
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                placeholder="Search..."
                className="border rounded-xl pl-10 pr-4 py-3 w-80"
              />

            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50 text-xs uppercase text-slate-500">

                <tr>

                  <th className="p-4 text-left">Case</th>
                  <th className="p-4 text-left">Loan</th>
                  <th className="p-4 text-left">Borrower</th>
                  <th className="p-4 text-left">Officer</th>
                  <th className="p-4 text-left">Branch</th>
                  <th className="p-4 text-left">Arrears</th>
                  <th className="p-4 text-left">Days</th>
                  <th className="p-4 text-left">Action</th>
                  <th className="p-4 text-left">Outcome</th>
                  <th className="p-4 text-left">Status</th>

                </tr>

              </thead>

              <tbody>

                {filtered.map((c:any)=>(

                  <tr
                    key={c.id}
                    className="border-t hover:bg-blue-50"
                  >

                    <td className="p-4 font-mono">{c.id}</td>

                    <td className="p-4">{c.loanNo}</td>

                    <td className="p-4">
                      <div className="font-bold text-blue-700">
                        {c.borrower}
                      </div>
                      <div className="text-xs text-slate-500">
                        {c.phone}
                      </div>
                    </td>

                    <td className="p-4">{c.officer}</td>

                    <td className="p-4">{c.branch}</td>

                    <td className="p-4 font-bold text-red-600">
                      {Number(c.arrears).toLocaleString()}
                    </td>

                    <td className="p-4">
                      {c.days}
                    </td>

                    <td className="p-4">
                      {c.action}
                    </td>

                    <td className="p-4">
                      {c.outcome}
                    </td>

                    <td className="p-4">

                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                        {c.status}
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

            <div className="bg-white rounded-3xl w-[760px] p-8">

              <div className="flex justify-between items-center mb-8">

                <h2 className="text-2xl font-black">
                  New Collection Case
                </h2>

                <button onClick={()=>setShowModal(false)}>
                  <Lucide.X />
                </button>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <input className="input" placeholder="Loan Number"
                  onChange={(e)=>setForm({...form,loanNo:e.target.value})}/>

                <input className="input" placeholder="Borrower"
                  onChange={(e)=>setForm({...form,borrower:e.target.value})}/>

                <input className="input" placeholder="Phone"
                  onChange={(e)=>setForm({...form,phone:e.target.value})}/>

                <input className="input" placeholder="Branch"
                  onChange={(e)=>setForm({...form,branch:e.target.value})}/>

                <input className="input" placeholder="Collection Officer"
                  onChange={(e)=>setForm({...form,officer:e.target.value})}/>

                <input className="input" placeholder="Outstanding Arrears"
                  onChange={(e)=>setForm({...form,arrears:e.target.value})}/>

                <input className="input" placeholder="Days in Arrears"
                  onChange={(e)=>setForm({...form,days:e.target.value})}/>

                <select
                  className="input"
                  onChange={(e)=>setForm({...form,action:e.target.value})}
                >
                  <option>Phone Call</option>
                  <option>SMS Reminder</option>
                  <option>Field Visit</option>
                  <option>Demand Letter</option>
                  <option>Legal Action</option>
                </select>

                <input
                  className="input"
                  placeholder="Outcome"
                  onChange={(e)=>setForm({...form,outcome:e.target.value})}
                />

                <input
                  type="date"
                  className="input"
                  onChange={(e)=>setForm({...form,nextVisit:e.target.value})}
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
                  onClick={saveCollection}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold"
                >
                  Save Collection
                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
};
