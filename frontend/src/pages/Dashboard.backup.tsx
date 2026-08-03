import { Sidebar } from '../components/layout/Sidebar';
import * as Lucide from 'lucide-react';

export const Dashboard = () => {

  const stats = [
    {
      title: "Total Portfolio",
      value: "UGX 4.8B",
      change: "+12.5%",
      icon: Lucide.Wallet,
    },
    {
      title: "Active Loans",
      value: "1,284",
      change: "+8.2%",
      icon: Lucide.Landmark,
    },
    {
      title: "Outstanding Balance",
      value: "UGX 2.1B",
      change: "-3.4%",
      icon: Lucide.Activity,
    },
    {
      title: "Collection Rate",
      value: "96.8%",
      change: "+2.1%",
      icon: Lucide.TrendingUp,
    },
  ];


  const branches = [
    {
      name:"Kampala Main",
      borrowers:"420",
      portfolio:"UGX 1.8B",
      collection:"98%"
    },
    {
      name:"Ntinda Branch",
      borrowers:"280",
      portfolio:"UGX 940M",
      collection:"96%"
    },
    {
      name:"Mbarara Branch",
      borrowers:"190",
      portfolio:"UGX 620M",
      collection:"94%"
    }
  ];


  return (

    <div className="flex h-screen bg-slate-50 text-slate-900">

      <Sidebar />


      <main className="flex-1 overflow-y-auto p-8">


        {/* HEADER */}

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-4xl font-black tracking-tight">
              Executive Dashboard
            </h1>

            <p className="text-slate-500 mt-2">
              Complete overview of Peak Lenders operations
            </p>

          </div>


          <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg">

            <Lucide.Plus size={18}/>

            New Loan

          </button>


        </div>




        {/* KPI CARDS */}


        <section className="grid grid-cols-4 gap-6 mb-8">


          {stats.map((item)=>{


            const Icon=item.icon;


            return (

              <div
                key={item.title}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition"
              >


                <div className="flex justify-between">


                  <div>

                    <p className="text-sm text-slate-500 font-medium">
                      {item.title}
                    </p>


                    <h2 className="text-3xl font-black mt-3">
                      {item.value}
                    </h2>


                    <p className="text-green-600 text-sm font-bold mt-2">
                      {item.change}
                    </p>


                  </div>


                  <div className="bg-blue-50 text-primary p-4 rounded-2xl h-fit">

                    <Icon size={26}/>

                  </div>


                </div>


              </div>

            )

          })}



        </section>






        {/* ANALYTICS AREA */}


        <section className="grid grid-cols-3 gap-6 mb-8">


          <div className="col-span-2 bg-white rounded-3xl p-7 border shadow-sm">


            <div className="flex justify-between mb-6">


              <div>

                <h2 className="text-xl font-black">
                  Portfolio Performance
                </h2>


                <p className="text-sm text-slate-500">
                  Loan growth and repayment trends
                </p>


              </div>


              <Lucide.BarChart3 className="text-primary"/>


            </div>



            <div className="h-64 flex items-end gap-5">


              {[45,65,40,80,70,90,75].map((height,index)=>(

                <div
                  key={index}
                  className="flex-1 bg-primary rounded-t-xl"
                  style={{
                    height:`${height}%`
                  }}
                />

              ))}


            </div>



          </div>





          <div className="bg-slate-900 text-white rounded-3xl p-7">


            <h2 className="text-xl font-black">
              Risk Monitor
            </h2>


            <p className="text-slate-400 text-sm mt-2">
              Current portfolio health
            </p>


            <div className="mt-8 space-y-5">


              <div>

                <div className="flex justify-between">

                  <span>Low Risk</span>

                  <b>82%</b>

                </div>


                <div className="h-2 bg-slate-700 rounded-full mt-2">

                  <div className="h-full bg-green-400 rounded-full w-[82%]"/>

                </div>


              </div>



              <div>

                <div className="flex justify-between">

                  <span>Medium Risk</span>

                  <b>14%</b>

                </div>


                <div className="h-2 bg-slate-700 rounded-full mt-2">

                  <div className="h-full bg-yellow-400 rounded-full w-[14%]"/>

                </div>


              </div>




              <div>

                <div className="flex justify-between">

                  <span>High Risk</span>

                  <b>4%</b>

                </div>


                <div className="h-2 bg-slate-700 rounded-full mt-2">

                  <div className="h-full bg-red-500 rounded-full w-[4%]"/>

                </div>


              </div>



            </div>


          </div>


        </section>








        {/* BRANCH PERFORMANCE */}


        <section className="bg-white rounded-3xl p-7 border shadow-sm">


          <div className="flex justify-between mb-6">


            <h2 className="text-xl font-black">
              Branch Performance
            </h2>


            <Lucide.Building2 className="text-primary"/>


          </div>




          <table className="w-full">


            <thead>

              <tr className="text-left text-slate-400 text-sm border-b">

                <th className="pb-4">
                  Branch
                </th>

                <th>
                  Borrowers
                </th>

                <th>
                  Portfolio
                </th>

                <th>
                  Collection
                </th>

              </tr>

            </thead>



            <tbody>


              {branches.map((b)=>(

                <tr
                  key={b.name}
                  className="border-b last:border-0"
                >

                  <td className="py-5 font-bold">
                    {b.name}
                  </td>


                  <td>
                    {b.borrowers}
                  </td>


                  <td>
                    {b.portfolio}
                  </td>


                  <td>

                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">

                      {b.collection}

                    </span>

                  </td>


                </tr>

              ))}


            </tbody>


          </table>


        </section>



      </main>


    </div>

  );

};
