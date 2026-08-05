import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";

export const BranchReports = () => {


  const branches = [
    {
      name:"Kampala Branch",
      borrowers:850,
      loans:420,
      disbursed:125000000,
      collected:112000000,
      outstanding:13000000,
      staff:18,
      performance:"Excellent"
    },
    {
      name:"Entebbe Branch",
      borrowers:420,
      loans:210,
      disbursed:68000000,
      collected:62000000,
      outstanding:6000000,
      staff:10,
      performance:"Good"
    },
    {
      name:"Jinja Branch",
      borrowers:610,
      loans:315,
      disbursed:94000000,
      collected:82000000,
      outstanding:12000000,
      staff:14,
      performance:"Good"
    }
  ];



  const totalBorrowers = branches.reduce(
    (a,b)=>a+b.borrowers,0
  );


  const totalLoans = branches.reduce(
    (a,b)=>a+b.loans,0
  );


  const totalDisbursed = branches.reduce(
    (a,b)=>a+b.disbursed,0
  );


  const totalCollected = branches.reduce(
    (a,b)=>a+b.collected,0
  );



  return (

    <div className="flex h-screen bg-slate-50">

      <Sidebar />


      <main className="flex-1 p-8 overflow-y-auto">


        <div className="flex justify-between items-center mb-8">


          <div>

            <h1 className="text-4xl font-black">
              Branch Reports
            </h1>

            <p className="text-slate-500">
              Compare branch performance and operations
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
              Branches
            </p>

            <h2 className="text-4xl font-black">
              {branches.length}
            </h2>

          </div>



          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Borrowers
            </p>

            <h2 className="text-4xl font-black text-blue-600">
              {totalBorrowers}
            </h2>

          </div>



          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Loans
            </p>

            <h2 className="text-4xl font-black">
              {totalLoans}
            </h2>

          </div>




          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Collections
            </p>

            <h2 className="text-3xl font-black text-green-600">
              {totalCollected.toLocaleString()}
            </h2>

          </div>


        </div>






        <div className="bg-white border rounded-2xl overflow-hidden">


          <div className="p-6 border-b">

            <h2 className="text-xl font-black">
              Branch Performance Register
            </h2>

          </div>




          <table className="w-full">


            <thead className="bg-slate-100">

              <tr>

                <th className="p-4 text-left">
                  Branch
                </th>

                <th className="p-4 text-left">
                  Borrowers
                </th>

                <th className="p-4 text-left">
                  Active Loans
                </th>

                <th className="p-4 text-left">
                  Disbursed
                </th>

                <th className="p-4 text-left">
                  Collected
                </th>

                <th className="p-4 text-left">
                  Outstanding
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

              </tr>

            </thead>




            <tbody>


            {branches.map(branch=>(

              <tr
                key={branch.name}
                className="border-t"
              >


                <td className="p-4 font-bold text-blue-700">
                  {branch.name}
                </td>


                <td className="p-4">
                  {branch.borrowers}
                </td>


                <td className="p-4">
                  {branch.loans}
                </td>


                <td className="p-4 font-bold">
                  {branch.disbursed.toLocaleString()}
                </td>


                <td className="p-4 font-bold text-green-600">
                  {branch.collected.toLocaleString()}
                </td>


                <td className="p-4 font-bold text-red-600">
                  {branch.outstanding.toLocaleString()}
                </td>


                <td className="p-4">

                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    branch.performance==="Excellent"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                  }`}>

                    {branch.performance}

                  </span>

                </td>


              </tr>

            ))}


            </tbody>


          </table>


        </div>







        <div className="mt-8 bg-white border rounded-3xl p-8">


          <h2 className="text-2xl font-black mb-4">
            Branch Network Summary
          </h2>


          <div className="flex justify-between text-lg">


            <span>
              Total Loan Disbursement
            </span>


            <span className="font-black">
              {totalDisbursed.toLocaleString()}
            </span>


          </div>


        </div>


      </main>


    </div>

  );

};
