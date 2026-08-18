import { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";
import { getCurrency, formatMoney, type Currency } from "../config/regional";

export const Withdrawals = () => {

  const [showModal,setShowModal] = useState(false);

  const [withdrawals,setWithdrawals] = useState([
    {
      id:"WD-0001",
      account:"100000001",
      customer:"John Doe",
      amount:100000,
      currency: getCurrency() as Currency,
      method:"Cash",
      officer:"Sarah",
      status:"Approved",
      date:"04 Aug 2026"
    },
    {
      id:"WD-0002",
      account:"100000002",
      customer:"Mary Namukasa",
      amount:250000,
      currency: getCurrency() as Currency,
      method:"Bank",
      officer:"David",
      status:"Pending",
      date:"04 Aug 2026"
    }
  ]);


  const [form,setForm] = useState({
    account:"",
    customer:"",
    amount:"",
    currency: getCurrency() as Currency,
    method:"",
    officer:""
  });



  const saveWithdrawal = () => {

    setWithdrawals([
      {
        id:`WD-${String(withdrawals.length+1).padStart(4,"0")}`,
        ...form,
        amount:Number(form.amount),
        status:"Pending",
        date:new Date().toLocaleDateString()
      },
      ...withdrawals
    ]);

    setShowModal(false);

  };



  return (

    <div className="flex h-screen bg-slate-50">

      <Sidebar />


      <main className="flex-1 p-8 overflow-y-auto">


        <div className="flex justify-between items-center mb-8">


          <div>

            <h1 className="text-4xl font-black">
              Withdrawals
            </h1>

            <p className="text-slate-500">
              Manage customer savings withdrawals
            </p>

          </div>


          <button
            onClick={()=>setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Lucide.Plus size={18}/>
            New Withdrawal
          </button>


        </div>




        <div className="grid grid-cols-4 gap-5 mb-8">


          <div className="bg-white rounded-2xl border p-6">
            <p className="text-sm text-slate-500">
              Total Withdrawals
            </p>

            <h2 className="text-4xl font-black">
              {withdrawals.length}
            </h2>
          </div>



          <div className="bg-white rounded-2xl border p-6">

            <p className="text-sm text-slate-500">
              Withdrawal Value
            </p>

            <h2 className="text-4xl font-black text-red-600">
              {withdrawals.reduce((a,b)=>a+b.amount,0).toLocaleString()}
            </h2>

          </div>



          <div className="bg-white rounded-2xl border p-6">

            <p className="text-sm text-slate-500">
              Pending
            </p>

            <h2 className="text-4xl font-black text-amber-600">
              {withdrawals.filter(w=>w.status==="Pending").length}
            </h2>

          </div>



          <div className="bg-white rounded-2xl border p-6">

            <p className="text-sm text-slate-500">
              Approved
            </p>

            <h2 className="text-4xl font-black text-green-600">
              {withdrawals.filter(w=>w.status==="Approved").length}
            </h2>

          </div>


        </div>





        <div className="bg-white rounded-2xl border overflow-hidden">


          <table className="w-full">


            <thead className="bg-slate-100">

              <tr>

                <th className="p-4 text-left">Reference</th>
                <th className="p-4 text-left">Account</th>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Method</th>
                <th className="p-4 text-left">Officer</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Date</th>

              </tr>

            </thead>



            <tbody>


            {withdrawals.map(w=>(

              <tr key={w.id} className="border-t">


                <td className="p-4 font-bold">
                  {w.id}
                </td>


                <td className="p-4">
                  {w.account}
                </td>


                <td className="p-4 font-bold text-blue-700">
                  {w.customer}
                </td>


                <td className="p-4 font-bold text-red-600">
                  {w.currency} {w.amount.toLocaleString()}
                </td>


                <td className="p-4">
                  {w.method}
                </td>


                <td className="p-4">
                  {w.officer}
                </td>


                <td className="p-4">

                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    w.status==="Approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {w.status}
                  </span>

                </td>


                <td className="p-4">
                  {w.date}
                </td>


              </tr>

            ))}


            </tbody>


          </table>


        </div>





        {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">


          <div className="bg-white rounded-3xl p-8 w-[650px]">


            <h2 className="text-2xl font-black mb-6">
              New Withdrawal
            </h2>



            <div className="grid grid-cols-2 gap-3">


              <input
              className="border rounded-xl p-3"
              placeholder="Account Number"
              onChange={e=>setForm({...form,account:e.target.value})}
              />


              <input
              className="border rounded-xl p-3"
              placeholder="Customer Name"
              onChange={e=>setForm({...form,customer:e.target.value})}
              />


              <input
              className="border rounded-xl p-3"
              placeholder="Amount"
              onChange={e=>setForm({...form,amount:e.target.value})}
              />


              <input
              className="border rounded-xl p-3"
              placeholder="Currency"
              onChange={e=>setForm({...form,currency:e.target.value as Currency})}
              />


              <input
              className="border rounded-xl p-3"
              placeholder="Method (Cash/Bank)"
              onChange={e=>setForm({...form,method:e.target.value})}
              />


              <input
              className="border rounded-xl p-3"
              placeholder="Officer"
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
              onClick={saveWithdrawal}
              className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold"
              >
                Save Withdrawal
              </button>


            </div>


          </div>


        </div>

        )}



      </main>

    </div>

  );

};
