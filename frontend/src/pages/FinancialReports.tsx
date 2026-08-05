import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";

export const FinancialReports = () => {


  const reports = [
    {
     name:"Total Revenue",
      amount:5600000,
      category:"Income"
    },
    {
      name:"Interest Income",
      amount:4500000,
      category:"Income"
    },
    {
      name:"Service Charges",
      amount:1100000,
      category:"Income"
    },
    {
      name:"Operating Expenses",
      amount:2500000,
      category:"Expense"
    },
    {
      name:"Loan Loss Provision",
      amount:700000,
      category:"Expense"
    }
  ];


  const income = reports
    .filter(r=>r.category==="Income")
    .reduce((a,b)=>a+b.amount,0);


  const expenses = reports
    .filter(r=>r.category==="Expense")
    .reduce((a,b)=>a+b.amount,0);


  const profit = income-expenses;



  return (

    <div className="flex h-screen bg-slate-50">

      <Sidebar />


      <main className="flex-1 p-8 overflow-y-auto">


        <div className="flex justify-between items-center mb-8">


          <div>

            <h1 className="text-4xl font-black">
              Financial Reports
            </h1>

            <p className="text-slate-500">
              Analyze revenue, expenses and financial performance
            </p>

          </div>


          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Lucide.Download size={18}/>
            Export Report
          </button>


        </div>





        <div className="grid grid-cols-4 gap-5 mb-8">


          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Revenue
            </p>

            <h2 className="text-4xl font-black text-green-600">
              {income.toLocaleString()}
            </h2>

          </div>



          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Expenses
            </p>

            <h2 className="text-4xl font-black text-red-600">
              {expenses.toLocaleString()}
            </h2>

          </div>




          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Net Profit
            </p>

            <h2 className="text-4xl font-black text-blue-600">
              {profit.toLocaleString()}
            </h2>

          </div>




          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Profit Margin
            </p>

            <h2 className="text-4xl font-black">
              {((profit/income)*100).toFixed(1)}%
            </h2>

          </div>


        </div>






        <div className="bg-white border rounded-2xl overflow-hidden">


          <div className="p-6 border-b">

            <h2 className="text-xl font-black">
              Financial Summary
            </h2>

          </div>




          <table className="w-full">


            <thead className="bg-slate-100">

              <tr>

                <th className="p-4 text-left">
                  Category
                </th>

                <th className="p-4 text-left">
                  Description
                </th>

                <th className="p-4 text-left">
                  Amount
                </th>

              </tr>

            </thead>




            <tbody>


            {reports.map((item,index)=>(

              <tr
                key={index}
                className="border-t"
              >

                <td className="p-4">

                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.category==="Income"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                  }`}>
                    {item.category}
                  </span>

                </td>


                <td className="p-4 font-bold">
                  {item.name}
                </td>


                <td className="p-4 font-black">
                  {item.amount.toLocaleString()}
                </td>


              </tr>

            ))}


            </tbody>


          </table>


        </div>






        <div className="grid grid-cols-3 gap-5 mt-8">


          <div className="bg-white border rounded-2xl p-6">

            <h3 className="font-black mb-2">
              Income Analysis
            </h3>

            <p className="text-slate-500">
              Track revenue streams and growth.
            </p>

          </div>




          <div className="bg-white border rounded-2xl p-6">

            <h3 className="font-black mb-2">
              Expense Control
            </h3>

            <p className="text-slate-500">
              Monitor operating costs.
            </p>

          </div>




          <div className="bg-white border rounded-2xl p-6">

            <h3 className="font-black mb-2">
              Profitability
            </h3>

            <p className="text-slate-500">
              Evaluate institution performance.
            </p>

          </div>


        </div>


      </main>

    </div>

  );

};
