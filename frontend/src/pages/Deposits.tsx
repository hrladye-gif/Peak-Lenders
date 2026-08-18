import { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";
import { getCurrency, formatMoney, type Currency } from "../config/regional";

export const Deposits = () => {

  const [showModal,setShowModal] = useState(false);

  const [deposits,setDeposits] = useState([
    {
      id:"DEP-0001",
      account:"100000001",
      customer:"John Doe",
      type:"Cash Deposit",
      amount:250000,
      currency: getCurrency() as Currency,
      channel:"Cash",
      officer:"Sarah",
      date:"04 Aug 2026"
    },
    {
      id:"DEP-0002",
      account:"100000002",
      customer:"Mary Namukasa",
      type:"Bank Deposit",
      amount:500000,
      currency: getCurrency() as Currency,
      channel:"Bank",
      officer:"David",
      date:"04 Aug 2026"
    }
  ]);


  const [form,setForm]=useState({
    account:"",
    customer:"",
    type:"",
    amount:"",
    currency: getCurrency() as Currency,
    channel:"",
    officer:""
  });


  const saveDeposit=()=>{

    setDeposits([
      {
        id:`DEP-${String(deposits.length+1).padStart(4,"0")}`,
        ...form,
        amount:Number(form.amount),
        date:new Date().toLocaleDateString()
      },
      ...deposits
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
              Deposits
            </h1>

            <p className="text-slate-500">
              Record and manage customer savings deposits
            </p>

          </div>


          <button
            onClick={()=>setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Lucide.Plus size={18}/>
            New Deposit
          </button>

        </div>



        <div className="grid grid-cols-4 gap-5 mb-8">


          <div className="bg-white rounded-2xl border p-6">
            <p className="text-sm text-slate-500">
              Total Deposits
            </p>

            <h2 className="text-4xl font-black">
              {deposits.length}
            </h2>
          </div>



          <div className="bg-white rounded-2xl border p-6">
            <p className="text-sm text-slate-500">
              Deposit Value
            </p>

            <h2 className="text-4xl font-black text-blue-600">
              {deposits.reduce((a,b)=>a+b.amount,0).toLocaleString()}
            </h2>
          </div>



          <div className="bg-white rounded-2xl border p-6">
            <p className="text-sm text-slate-500">
              Cash Deposits
            </p>

            <h2 className="text-4xl font-black">
              {deposits.filter(d=>d.channel==="Cash").length}
            </h2>
          </div>



          <div className="bg-white rounded-2xl border p-6">
            <p className="text-sm text-slate-500">
              Bank Deposits
            </p>

            <h2 className="text-4xl font-black">
              {deposits.filter(d=>d.channel==="Bank").length}
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
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Channel</th>
                <th className="p-4 text-left">Officer</th>
                <th className="p-4 text-left">Date</th>
              </tr>

            </thead>



            <tbody>


            {deposits.map(deposit=>(

              <tr key={deposit.id} className="border-t">


                <td className="p-4 font-bold">
                  {deposit.id}
                </td>


                <td className="p-4">
                  {deposit.account}
                </td>


                <td className="p-4 font-bold text-blue-700">
                  {deposit.customer}
                </td>


                <td className="p-4">
                  {deposit.type}
                </td>


                <td className="p-4 font-bold text-green-600">
                  {deposit.currency} {deposit.amount.toLocaleString()}
                </td>


                <td className="p-4">
                  {deposit.channel}
                </td>


                <td className="p-4">
                  {deposit.officer}
                </td>


                <td className="p-4">
                  {deposit.date}
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
              Record Deposit
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
              placeholder="Deposit Type"
              onChange={e=>setForm({...form,type:e.target.value})}
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
              placeholder="Channel (Cash/Bank)"
              onChange={e=>setForm({...form,channel:e.target.value})}
              />


              <input
              className="border rounded-xl p-3 col-span-2"
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
              onClick={saveDeposit}
              className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold"
              >
                Save Deposit
              </button>

            </div>


          </div>


        </div>

        )}


      </main>

    </div>

  );

};
