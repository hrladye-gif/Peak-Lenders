import { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";

export const WriteOffs = () => {

  const [showModal, setShowModal] = useState(false);

  const [writeOffs, setWriteOffs] = useState([
    {
      id: "WO-0001",
      loan: "LN-0001",
      borrower: "John Doe",
      amount: 1200000,
      reason: "Customer deceased",
      officer: "Sarah",
      status: "Pending",
      date: "04 Aug 2026"
    }
  ]);

  const [form, setForm] = useState({
    loan: "",
    borrower: "",
    amount: "",
    reason: "",
    officer: ""
  });


  const saveWriteOff = () => {

    setWriteOffs([
      {
        id: `WO-${String(writeOffs.length + 1).padStart(4,"0")}`,
        loan: form.loan,
        borrower: form.borrower,
        amount: Number(form.amount),
        reason: form.reason,
        officer: form.officer,
        status: "Pending",
        date: new Date().toLocaleDateString()
      },
      ...writeOffs
    ]);

    setShowModal(false);

    setForm({
      loan:"",
      borrower:"",
      amount:"",
      reason:"",
      officer:""
    });

  };


  return (

    <div className="flex h-screen bg-slate-50">

      <Sidebar />


      <main className="flex-1 p-8 overflow-y-auto">


        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-4xl font-black">
              WriteOffs
            </h1>

            <p className="text-slate-500">
              Manage non-performing loan writeoffs
            </p>
          </div>


          <button
            onClick={()=>setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex gap-2 items-center"
          >
            <Lucide.Plus size={18}/>
            New WriteOff
          </button>

        </div>



        <div className="grid grid-cols-3 gap-5 mb-8">

          <div className="bg-white p-6 rounded-2xl border">
            <p className="text-sm text-slate-500">
              Total Cases
            </p>
            <h2 className="text-3xl font-black">
              {writeOffs.length}
            </h2>
          </div>


          <div className="bg-white p-6 rounded-2xl border">
            <p className="text-sm text-slate-500">
              Written Off Amount
            </p>
            <h2 className="text-3xl font-black text-red-600">
              {writeOffs.reduce((a,b)=>a+b.amount,0).toLocaleString()}
            </h2>
          </div>


          <div className="bg-white p-6 rounded-2xl border">
            <p className="text-sm text-slate-500">
              Pending Approval
            </p>
            <h2 className="text-3xl font-black">
              {writeOffs.filter(x=>x.status==="Pending").length}
            </h2>
          </div>

        </div>



        <div className="bg-white rounded-2xl border overflow-hidden">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>
                <th className="p-4 text-left">Reference</th>
                <th className="p-4 text-left">Borrower</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Reason</th>
                <th className="p-4 text-left">Officer</th>
                <th className="p-4 text-left">Status</th>
              </tr>

            </thead>


            <tbody>

              {writeOffs.map(item=>(

                <tr key={item.id} className="border-t">

                  <td className="p-4 font-bold">
                    {item.id}
                  </td>

                  <td className="p-4">
                    {item.borrower}
                  </td>

                  <td className="p-4 text-red-600 font-bold">
                    UGX {item.amount.toLocaleString()}
                  </td>

                  <td className="p-4">
                    {item.reason}
                  </td>

                  <td className="p-4">
                    {item.officer}
                  </td>

                  <td className="p-4">
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                      {item.status}
                    </span>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>




        {showModal && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

            <div className="bg-white rounded-3xl p-8 w-[600px]">


              <h2 className="text-2xl font-black mb-5">
                New WriteOff
              </h2>


              <div className="space-y-3">

                <input className="border p-3 w-full rounded-xl"
                  placeholder="Loan Number"
                  onChange={e=>setForm({...form,loan:e.target.value})}
                />


                <input className="border p-3 w-full rounded-xl"
                  placeholder="Borrower"
                  onChange={e=>setForm({...form,borrower:e.target.value})}
                />


                <input className="border p-3 w-full rounded-xl"
                  placeholder="Amount"
                  onChange={e=>setForm({...form,amount:e.target.value})}
                />


                <input className="border p-3 w-full rounded-xl"
                  placeholder="Reason"
                  onChange={e=>setForm({...form,reason:e.target.value})}
                />


                <input className="border p-3 w-full rounded-xl"
                  placeholder="Loan Officer"
                  onChange={e=>setForm({...form,officer:e.target.value})}
                />

              </div>


              <div className="flex justify-end gap-3 mt-6">

                <button
                  onClick={()=>setShowModal(false)}
                  className="px-5 py-3"
                >
                  Cancel
                </button>


                <button
                  onClick={saveWriteOff}
                  className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold"
                >
                  Save
                </button>

              </div>


            </div>

          </div>

        )}


      </main>

    </div>

  );

};
