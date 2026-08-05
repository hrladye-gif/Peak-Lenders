import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";

export const PortfolioReports = () => {


  const portfolio = [
    {
      branch:"Kampala",
      loans:245,
      outstanding:85000000,
      overdue:6500000,
      par:"7.6%",
      collection:"92%"
    },
    {
      branch:"Entebbe",
      loans:120,
      outstanding:42000000,
      overdue:1800000,
      par:"4.2%",
      collection:"96%"
    },
    {
      branch:"Jinja",
      loans:180,
      outstanding:61000000,
      overdue:4500000,
      par:"7.3%",
      collection:"91%"
    }
  ];


  const totalLoans = portfolio.reduce(
    (a,b)=>a+b.loans,0
  );


  const totalOutstanding = portfolio.reduce(
    (a,b)=>a+b.outstanding,0
  );


  const totalOverdue = portfolio.reduce(
    (a,b)=>a+b.overdue,0
  );


  return (

    <div className="flex h-screen bg-slate-50">

      <Sidebar />


      <main className="flex-1 p-8 overflow-y-auto">


        <div className="flex justify-between items-center mb-8">


          <div>

            <h1 className="text-4xl font-black">
              Portfolio Reports
            </h1>

            <p className="text-slate-500">
              Analyze loan portfolio performance and risk
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
              Total Loans
            </p>

            <h2 className="text-4xl font-black">
              {totalLoans}
            </h2>

          </div>




          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Outstanding Portfolio
            </p>

            <h2 className="text-3xl font-black text-blue-600">
              {totalOutstanding.toLocaleString()}
            </h2>

          </div>




          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Overdue Amount
            </p>

            <h2 className="text-3xl font-black text-red-600">
              {totalOverdue.toLocaleString()}
            </h2>

          </div>




          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Portfolio Health
            </p>

            <h2 className="text-3xl font-black text-green-600">
              Good
            </h2>

          </div>


        </div>






        <div className="bg-white border rounded-2xl overflow-hidden">


          <div className="p-6 border-b">

            <h2 className="text-xl font-black">
              Branch Portfolio Performance
            </h2>

          </div>




          <table className="w-full">


            <thead className="bg-slate-100">

              <tr>

                <th className="p-4 text-left">
                  Branch
                </th>

                <th className="p-4 text-left">
                  Active Loans
                </th>

                <th className="p-4 text-left">
                  Outstanding
                </th>

                <th className="p-4 text-left">
                  Overdue
                </th>

                <th className="p-4 text-left">
                  PAR
                </th>

                <th className="p-4 text-left">
                  Collection Rate
                </th>

              </tr>

            </thead>




            <tbody>


            {portfolio.map(row=>(

              <tr
                key={row.branch}
                className="border-t"
              >

                <td className="p-4 font-bold text-blue-700">
                  {row.branch}
                </td>


                <td className="p-4">
                  {row.loans}
                </td>


                <td className="p-4 font-bold">
                  {row.outstanding.toLocaleString()}
                </td>


                <td className="p-4 font-bold text-red-600">
                  {row.overdue.toLocaleString()}
                </td>


                <td className="p-4">

                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                    {row.par}
                  </span>

                </td>


                <td className="p-4 font-bold text-green-600">
                  {row.collection}
                </td>


              </tr>

            ))}


            </tbody>


          </table>


        </div>





        <div className="mt-8 grid grid-cols-3 gap-5">


          <div className="bg-white border rounded-2xl p-6">

            <h3 className="font-black mb-2">
              Risk Analysis
            </h3>

            <p className="text-slate-500">
              Monitor portfolio at risk and overdue loans.
            </p>

          </div>



          <div className="bg-white border rounded-2xl p-6">

            <h3 className="font-black mb-2">
              Loan Growth
            </h3>

            <p className="text-slate-500">
              Track loan book expansion by branch.
            </p>

          </div>



          <div className="bg-white border rounded-2xl p-6">

            <h3 className="font-black mb-2">
              Collections
            </h3>

            <p className="text-slate-500">
              Measure repayment performance.
            </p>

          </div>


        </div>


      </main>

    </div>

  );

};
