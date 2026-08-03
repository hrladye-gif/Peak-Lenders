import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";

const activities = [
  {
    id: 1,
    user: "Loan Officer - Andrew",
    action: "Approved loan application",
    target: "John Doe",
    branch: "Kampala Branch",
    type: "Loan Approval",
    time: "10 minutes ago",
  },
  {
    id: 2,
    user: "System Engine",
    action: "Generated repayment schedule",
    target: "Loan #PL-10482",
    branch: "Nairobi Branch",
    type: "System",
    time: "1 hour ago",
  },
  {
    id: 3,
    user: "Sarah Kimani",
    action: "Updated borrower profile",
    target: "Mary Wanjiku",
    branch: "Mombasa Branch",
    type: "Profile Update",
    time: "3 hours ago",
  },
  {
    id: 4,
    user: "Collection Officer",
    action: "Recorded repayment",
    target: "KES 45,000 Payment",
    branch: "Kampala Branch",
    type: "Payment",
    time: "5 hours ago",
  },
];


export const ActivityFeed = () => {

  const systemEvents = activities.filter(
    (a)=>a.type==="System"
  ).length;


  const loanEvents = activities.filter(
    (a)=>a.type==="Loan Approval"
  ).length;


  return (

    <div className="flex h-screen bg-slate-50 text-slate-800">

      <Sidebar />


      <div className="flex-1 overflow-y-auto">


        {/* HEADER */}

        <header className="bg-white border-b px-8 py-6 flex justify-between items-center">

          <div>

            <h1 className="text-3xl font-black text-slate-900">
              Activity Feed
            </h1>

            <p className="text-slate-500 mt-1">
              Complete audit trail of lender operations
            </p>

          </div>


          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold">

            <Lucide.RefreshCw size={18}/>

            Refresh

          </button>


        </header>



        <main className="p-8">



          {/* SUMMARY */}


          <div className="grid grid-cols-3 gap-6 mb-8">


            <div className="bg-white rounded-3xl border p-6 shadow-sm">

              <div className="flex justify-between">

                <div>

                  <p className="text-xs uppercase font-bold text-slate-400">
                    Total Events
                  </p>

                  <h2 className="text-4xl font-black mt-3">
                    {activities.length}
                  </h2>

                </div>

                <div className="bg-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center">

                  <Lucide.Activity className="text-white"/>

                </div>

              </div>

            </div>



            <div className="bg-white rounded-3xl border p-6 shadow-sm">

              <div className="flex justify-between">

                <div>

                  <p className="text-xs uppercase font-bold text-slate-400">
                    Loan Actions
                  </p>

                  <h2 className="text-4xl font-black mt-3 text-blue-600">
                    {loanEvents}
                  </h2>

                </div>

                <div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center">

                  <Lucide.FileCheck className="text-blue-600"/>

                </div>

              </div>

            </div>




            <div className="bg-white rounded-3xl border p-6 shadow-sm">

              <div className="flex justify-between">

                <div>

                  <p className="text-xs uppercase font-bold text-slate-400">
                    System Events
                  </p>

                  <h2 className="text-4xl font-black mt-3 text-indigo-600">
                    {systemEvents}
                  </h2>

                </div>


                <div className="bg-indigo-100 w-14 h-14 rounded-2xl flex items-center justify-center">

                  <Lucide.Server className="text-indigo-600"/>

                </div>


              </div>

            </div>


          </div>




          {/* TIMELINE */}


          <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">


            <div className="px-8 py-6 border-b flex justify-between">

              <div>

                <h2 className="text-xl font-black">
                  Recent Operations
                </h2>

                <p className="text-sm text-slate-500">
                  Real-time institutional activity monitoring
                </p>

              </div>

              <Lucide.History className="text-slate-400"/>

            </div>



            <div className="divide-y">


              {activities.map((a)=>(


                <div
                key={a.id}
                className="p-8 flex gap-6 hover:bg-slate-50 transition"
                >


                  <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center">

                    <Lucide.Activity
                    className="text-white"
                    />

                  </div>



                  <div className="flex-1">


                    <div className="flex justify-between">


                      <div>

                        <h3 className="font-bold text-lg">
                          {a.user}
                        </h3>


                        <p className="text-slate-600 mt-1">

                          {a.action}

                          {" "}

                          <span className="font-bold text-blue-600">
                            {a.target}
                          </span>

                        </p>


                      </div>


                      <span className="text-sm text-slate-400">
                        {a.time}
                      </span>


                    </div>



                    <div className="flex gap-6 mt-4 text-sm text-slate-500">


                      <span className="flex gap-2 items-center">

                        <Lucide.MapPin size={15}/>

                        {a.branch}

                      </span>


                      <span className="flex gap-2 items-center">

                        <Lucide.Tag size={15}/>

                        {a.type}

                      </span>


                    </div>



                  </div>



                </div>


              ))}


            </div>


          </div>



        </main>


      </div>


    </div>

  );
};
