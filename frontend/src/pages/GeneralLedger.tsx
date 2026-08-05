import { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";

export const GeneralLedger = () => {

  const [search,setSearch] = useState("");

  const [ledger,setLedger] = useState([
    {
      id:"GL-0001",
      date:"04 Aug 2026",
      account:"Cash",
      reference:"LOAN-DISB-0001",
      description:"Loan disbursement",
      debit:0,
      credit:5000000,
      balance:3500000
    },
    {
      id:"GL-0002",
      date:"04 Aug 2026",
      account:"Loans Receivable",
      reference:"LOAN-DISB-0001",
      description:"Loan issued to borrower",
      debit:5000000,
      credit:0,
      balance:5000000
    },
    {
      id:"GL-0003",
      date:"04 Aug 2026",
      account:"Customer Savings",
      reference:"DEP-0001",
      description:"Customer deposit",
      debit:0,
      credit:250000,
      balance:15250000
    }
  ]);


  const filtered = ledger.filter(item =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );


  const totalDebit = ledger.reduce(
    (a,b)=>a+b.debit,0
  );

  const totalCredit = ledger.reduce(
    (a,b)=>a+b.credit,0
  );


  return (

    <div className="flex h-screen bg-slate-50">

      <Sidebar />


      <main className="flex-1 p-8 overflow-y-auto">


        <div className="flex justify-between items-center mb-8">


          <div>

            <h1 className="text-4xl font-black">
              General Ledger
            </h1>

            <p className="text-slate-500">
              View all financial transactions by account
            </p>

          </div>


          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Lucide.Download size={18}/>
            Export Ledger
          </button>


        </div>





        <div className="grid grid-cols-4 gap-5 mb-8">


          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Transactions
            </p>
            <h2 className="text-4xl font-black">
              {ledger.length}
            </h2>
          </div>


          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Total Debits
            </p>
            <h2 className="text-3xl font-black text-blue-600">
              {totalDebit.toLocaleString()}
            </h2>
          </div>


          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Total Credits
            </p>
            <h2 className="text-3xl font-black text-red-600">
              {totalCredit.toLocaleString()}
            </h2>
          </div>


          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Accounts
            </p>
            <h2 className="text-4xl font-black">
              {new Set(ledger.map(x=>x.account)).size}
            </h2>
          </div>


        </div>





        <div className="bg-white rounded-2xl border overflow-hidden">


          <div className="p-5 border-b">

            <input
              className="border rounded-xl px-4 py-3 w-96"
              placeholder="Search ledger..."
              value={search}
              onChange={e=>setSearch(e.target.value)}
            />

          </div>



          <table className="w-full">


            <thead className="bg-slate-100">

              <tr>

                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Account</th>
                <th className="p-4 text-left">Reference</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">Debit</th>
                <th className="p-4 text-left">Credit</th>
                <th className="p-4 text-left">Balance</th>

              </tr>

            </thead>



            <tbody>


            {filtered.map(item=>(

              <tr key={item.id} className="border-t">


                <td className="p-4">
                  {item.date}
                </td>


                <td className="p-4 font-bold text-blue-700">
                  {item.account}
                </td>


                <td className="p-4">
                  {item.reference}
                </td>


                <td className="p-4">
                  {item.description}
                </td>


                <td className="p-4 text-green-600 font-bold">
                  {item.debit.toLocaleString()}
                </td>


                <td className="p-4 text-red-600 font-bold">
                  {item.credit.toLocaleString()}
                </td>


                <td className="p-4 font-bold">
                  {item.balance.toLocaleString()}
                </td>


              </tr>

            ))}


            </tbody>


          </table>


        </div>


      </main>

    </div>

  );

};
