import { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";

export const JournalEntries = () => {

  const [showModal,setShowModal] = useState(false);

  const [entries,setEntries] = useState([
    {
      id:"JE-0001",
      date:"04 Aug 2026",
      reference:"LOAN-DISB-0001",
      description:"Loan disbursement to borrower",
      debit:"Loans Receivable",
      credit:"Cash",
      amount:5000000,
      status:"Posted"
    },
    {
      id:"JE-0002",
      date:"04 Aug 2026",
      reference:"DEP-0001",
      description:"Customer savings deposit",
      debit:"Cash",
      credit:"Customer Savings",
      amount:250000,
      status:"Posted"
    }
  ]);


  const [form,setForm]=useState({
    reference:"",
    description:"",
    debit:"",
    credit:"",
    amount:""
  });



  const saveEntry=()=>{

    setEntries([
      {
        id:`JE-${String(entries.length+1).padStart(4,"0")}`,
        date:new Date().toLocaleDateString(),
        ...form,
        amount:Number(form.amount),
        status:"Draft"
      },
      ...entries
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
              Journal Entries
            </h1>

            <p className="text-slate-500">
              Record and manage accounting transactions
            </p>

          </div>


          <button
            onClick={()=>setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Lucide.Plus size={18}/>
            New Journal Entry
          </button>


        </div>





        <div className="grid grid-cols-4 gap-5 mb-8">


          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Total Entries
            </p>
            <h2 className="text-4xl font-black">
              {entries.length}
            </h2>
          </div>


          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Posted
            </p>
            <h2 className="text-4xl font-black text-green-600">
              {entries.filter(e=>e.status==="Posted").length}
            </h2>
          </div>


          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Drafts
            </p>
            <h2 className="text-4xl font-black text-amber-600">
              {entries.filter(e=>e.status==="Draft").length}
            </h2>
          </div>


          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Value
            </p>
            <h2 className="text-4xl font-black">
              {entries.reduce((a,b)=>a+b.amount,0).toLocaleString()}
            </h2>
          </div>


        </div>





        <div className="bg-white border rounded-2xl overflow-hidden">


          <table className="w-full">


            <thead className="bg-slate-100">

              <tr>

                <th className="p-4 text-left">Reference</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">Debit</th>
                <th className="p-4 text-left">Credit</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Status</th>

              </tr>

            </thead>



            <tbody>


            {entries.map(entry=>(

              <tr key={entry.id} className="border-t">


                <td className="p-4 font-bold">
                  {entry.reference}
                </td>


                <td className="p-4">
                  {entry.date}
                </td>


                <td className="p-4">
                  {entry.description}
                </td>


                <td className="p-4 text-blue-700 font-bold">
                  {entry.debit}
                </td>


                <td className="p-4 text-red-700 font-bold">
                  {entry.credit}
                </td>


                <td className="p-4 font-bold">
                  {entry.amount.toLocaleString()}
                </td>


                <td className="p-4">

                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    entry.status==="Posted"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {entry.status}
                  </span>

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
              New Journal Entry
            </h2>


            <div className="space-y-3">


              <input
              className="border rounded-xl p-3 w-full"
              placeholder="Reference"
              onChange={e=>setForm({...form,reference:e.target.value})}
              />


              <input
              className="border rounded-xl p-3 w-full"
              placeholder="Description"
              onChange={e=>setForm({...form,description:e.target.value})}
              />


              <input
              className="border rounded-xl p-3 w-full"
              placeholder="Debit Account"
              onChange={e=>setForm({...form,debit:e.target.value})}
              />


              <input
              className="border rounded-xl p-3 w-full"
              placeholder="Credit Account"
              onChange={e=>setForm({...form,credit:e.target.value})}
              />


              <input
              className="border rounded-xl p-3 w-full"
              placeholder="Amount"
              onChange={e=>setForm({...form,amount:e.target.value})}
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
              onClick={saveEntry}
              className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold"
              >
                Save Entry
              </button>


            </div>


          </div>


        </div>

        )}


      </main>

    </div>

  );

};
