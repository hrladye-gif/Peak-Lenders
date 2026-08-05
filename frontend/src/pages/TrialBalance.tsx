import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";

export const TrialBalance = () => {


  const accounts = [
    {
      code:"1000",
      account:"Cash",
      debit:3500000,
      credit:0
    },
    {
      code:"1100",
      account:"Bank Account",
      debit:8500000,
      credit:0
    },
    {
      code:"1200",
      account:"Loans Receivable",
      debit:5000000,
      credit:0
    },
    {
      code:"2000",
      account:"Customer Savings",
      debit:0,
      credit:15250000
    },
    {
      code:"4000",
      account:"Interest Income",
      debit:0,
      credit:1750000
    }
  ];


  const totalDebit = accounts.reduce(
    (a,b)=>a+b.debit,0
  );


  const totalCredit = accounts.reduce(
    (a,b)=>a+b.credit,0
  );


  const balanced = totalDebit === totalCredit;



  return (

    <div className="flex h-screen bg-slate-50">

      <Sidebar />


      <main className="flex-1 p-8 overflow-y-auto">


        <div className="flex justify-between items-center mb-8">


          <div>

            <h1 className="text-4xl font-black">
              Trial Balance
            </h1>

            <p className="text-slate-500">
              Verify debit and credit balances before financial reporting
            </p>

          </div>


          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Lucide.Download size={18}/>
            Export Report
          </button>


        </div>





        <div className="grid grid-cols-3 gap-5 mb-8">


          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Total Debit
            </p>

            <h2 className="text-4xl font-black text-blue-600">
              {totalDebit.toLocaleString()}
            </h2>

          </div>



          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Total Credit
            </p>

            <h2 className="text-4xl font-black text-red-600">
              {totalCredit.toLocaleString()}
            </h2>

          </div>



          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Status
            </p>

            <h2 className={`text-3xl font-black ${
              balanced
              ? "text-green-600"
              : "text-red-600"
            }`}>
              {balanced ? "Balanced" : "Mismatch"}
            </h2>

          </div>


        </div>





        <div className="bg-white border rounded-2xl overflow-hidden">


          <table className="w-full">


            <thead className="bg-slate-100">

              <tr>

                <th className="p-4 text-left">
                  Account Code
                </th>

                <th className="p-4 text-left">
                  Account Name
                </th>

                <th className="p-4 text-left">
                  Debit
                </th>

                <th className="p-4 text-left">
                  Credit
                </th>

              </tr>

            </thead>




            <tbody>


            {accounts.map(account=>(

              <tr
                key={account.code}
                className="border-t"
              >

                <td className="p-4 font-bold">
                  {account.code}
                </td>


                <td className="p-4 font-bold text-blue-700">
                  {account.account}
                </td>


                <td className="p-4 font-bold">
                  {account.debit.toLocaleString()}
                </td>


                <td className="p-4 font-bold">
                  {account.credit.toLocaleString()}
                </td>


              </tr>

            ))}



            <tr className="border-t bg-slate-50 font-black">

              <td className="p-4" colSpan={2}>
                TOTAL
              </td>


              <td className="p-4">
                {totalDebit.toLocaleString()}
              </td>


              <td className="p-4">
                {totalCredit.toLocaleString()}
              </td>

            </tr>


            </tbody>


          </table>


        </div>



      </main>

    </div>

  );

};
