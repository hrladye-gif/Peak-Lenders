import { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";

export const AuditTrail = () => {


  const [search,setSearch] = useState("");


  const logs = [
    {
      id:"AUD-0001",
      user:"Admin User",
      action:"Created new borrower",
      module:"Borrowers",
      description:"Added borrower John Doe",
      date:"04 Aug 2026 09:30",
      status:"Success"
    },
    {
      id:"AUD-0002",
      user:"Sarah Nakato",
      action:"Approved loan application",
      module:"Loans",
      description:"Loan LN-0001 approved",
      date:"04 Aug 2026 10:15",
      status:"Success"
    },
    {
      id:"AUD-0003",
      user:"David Okello",
      action:"Updated repayment",
      module:"Repayments",
      description:"Payment record modified",
      date:"04 Aug 2026 10:45",
      status:"Success"
    },
    {
      id:"AUD-0004",
      user:"Admin User",
      action:"Changed user permissions",
      module:"Administration",
      description:"Updated Loan Officer role",
      date:"04 Aug 2026 11:10",
      status:"Warning"
    }
  ];



  const filtered = logs.filter(log =>
    Object.values(log)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );



  return (

    <div className="flex h-screen bg-slate-50">


      <Sidebar />


      <main className="flex-1 p-8 overflow-y-auto">



        <div className="flex justify-between items-center mb-8">


          <div>

            <h1 className="text-4xl font-black">
              Audit Trail
            </h1>

            <p className="text-slate-500">
              Track all system activities and user actions
            </p>

          </div>


          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >

            <Lucide.Download size={18}/>

            Export Logs

          </button>


        </div>






        <div className="grid grid-cols-4 gap-5 mb-8">


          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Total Events
            </p>

            <h2 className="text-4xl font-black">
              {logs.length}
            </h2>

          </div>



          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Successful
            </p>

            <h2 className="text-4xl font-black text-green-600">
              {
                logs.filter(l=>l.status==="Success").length
              }
            </h2>

          </div>




          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Users
            </p>

            <h2 className="text-4xl font-black text-blue-600">
              {
                new Set(logs.map(l=>l.user)).size
              }
            </h2>

          </div>




          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Modules
            </p>

            <h2 className="text-4xl font-black">
              {
                new Set(logs.map(l=>l.module)).size
              }
            </h2>

          </div>


        </div>








        <div className="bg-white border rounded-3xl overflow-hidden">


          <div className="p-6 border-b flex justify-between">


            <h2 className="text-xl font-black">
              Activity Logs
            </h2>



            <input
              className="border rounded-xl px-4 py-2 w-80"
              placeholder="Search audit logs..."
              value={search}
              onChange={e=>setSearch(e.target.value)}
            />


          </div>






          <table className="w-full">


            <thead className="bg-slate-100">


              <tr>

                <th className="p-4 text-left">
                  Reference
                </th>

                <th className="p-4 text-left">
                  User
                </th>

                <th className="p-4 text-left">
                  Action
                </th>

                <th className="p-4 text-left">
                  Module
                </th>

                <th className="p-4 text-left">
                  Description
                </th>

                <th className="p-4 text-left">
                  Date
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

              </tr>


            </thead>




            <tbody>


            {filtered.map(log=>(

              <tr
                key={log.id}
                className="border-t hover:bg-blue-50"
              >


                <td className="p-4 font-mono font-bold">
                  {log.id}
                </td>


                <td className="p-4 font-bold text-blue-700">
                  {log.user}
                </td>


                <td className="p-4">
                  {log.action}
                </td>


                <td className="p-4">
                  {log.module}
                </td>


                <td className="p-4">
                  {log.description}
                </td>


                <td className="p-4 text-sm">
                  {log.date}
                </td>


                <td className="p-4">

                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    log.status==="Success"
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                  }`}>

                    {log.status}

                  </span>

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
