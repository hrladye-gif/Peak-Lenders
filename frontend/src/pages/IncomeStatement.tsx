import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";

export const IncomeStatement = () => {


  const income = [
    {
      name:"Loan Interest Income",
      amount:4500000
    },
    {
      name:"Penalty Income",
      amount:350000
    },
    {
      name:"Service Fees",
      amount:750000
    }
  ];


  const expenses = [
    {
      name:"Staff Salaries",
      amount:1800000
    },
    {
      name:"Office Expenses",
      amount:450000
    },
    {
      name:"Loan Recovery Expenses",
      amount:250000
    }
  ];


  const totalIncome = income.reduce(
    (a,b)=>a+b.amount,0
  );


  const totalExpenses = expenses.reduce(
    (a,b)=>a+b.amount,0
  );


  const profit = totalIncome - totalExpenses;



  return (

    <div className="flex h-screen bg-slate-50">

      <Sidebar />


      <main className="flex-1 p-8 overflow-y-auto">


        <div className="flex justify-between items-center mb-8">


          <div>

            <h1 className="text-4xl font-black">
              Income Statement
            </h1>

            <p className="text-slate-500">
              Revenue, expenses and profitability report
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
              Total Income
            </p>

            <h2 className="text-4xl font-black text-green-600">
              {totalIncome.toLocaleString()}
            </h2>

          </div>




          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Total Expenses
            </p>

            <h2 className="text-4xl font-black text-red-600">
              {totalExpenses.toLocaleString()}
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


        </div>






        <div className="grid grid-cols-2 gap-8">


          <div className="bg-white border rounded-2xl overflow-hidden">


            <div className="p-5 border-b bg-green-50">

              <h2 className="text-xl font-black">
                Income
              </h2>

            </div>



            <table className="w-full">


              <tbody>


              {income.map(item=>(

                <tr
                  key={item.name}
                  className="border-t"
                >

                  <td className="p-4 font-bold">
                    {item.name}
                  </td>


                  <td className="p-4 text-right font-bold text-green-600">
                    {item.amount.toLocaleString()}
                  </td>

                </tr>

              ))}



              <tr className="border-t bg-slate-50 font-black">

                <td className="p-4">
                  Total Income
                </td>

                <td className="p-4 text-right">
                  {totalIncome.toLocaleString()}
                </td>

              </tr>


              </tbody>


            </table>


          </div>






          <div className="bg-white border rounded-2xl overflow-hidden">


            <div className="p-5 border-b bg-red-50">

              <h2 className="text-xl font-black">
                Expenses
              </h2>

            </div>



            <table className="w-full">


              <tbody>


              {expenses.map(item=>(

                <tr
                  key={item.name}
                  className="border-t"
                >

                  <td className="p-4 font-bold">
                    {item.name}
                  </td>


                  <td className="p-4 text-right font-bold text-red-600">
                    {item.amount.toLocaleString()}
                  </td>

                </tr>

              ))}



              <tr className="border-t bg-slate-50 font-black">

                <td className="p-4">
                  Total Expenses
                </td>


                <td className="p-4 text-right">
                  {totalExpenses.toLocaleString()}
                </td>

              </tr>


              </tbody>


            </table>


          </div>


        </div>





        <div className="mt-8 bg-white border rounded-3xl p-8">


          <h2 className="text-2xl font-black mb-4">
            Net Income Summary
          </h2>


          <div className="flex justify-between text-xl">

            <span>
              Income - Expenses
            </span>


            <span className="font-black text-blue-600">
              {profit.toLocaleString()}
            </span>


          </div>


        </div>



      </main>

    </div>

  );

};
