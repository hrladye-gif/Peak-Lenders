import { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";
import { getCurrency, formatMoney, type Currency } from "../config/regional";

export const Tenants = () => {


  const [showModal,setShowModal] = useState(false);


  const [tenants,setTenants] = useState([
    {
      id:"TEN-001",
      name:"Peak Lenders",
      code:"PL001",
      country:"Uganda",
      currency: getCurrency() as Currency,
      branches:3,
      users:25,
      status:"Active"
    },
    {
      id:"TEN-002",
      name:"Demo Microfinance",
      code:"DM001",
      country:"Uganda",
      currency: getCurrency() as Currency,
      branches:2,
      users:12,
      status:"Active"
    }
  ]);



  const [form,setForm]=useState({
    name:"",
    code:"",
    country:"",
    currency:""
  });



  const addTenant=()=>{

    setTenants([
      {
        id:`TEN-${String(tenants.length+1).padStart(3,"0")}`,
        ...form,
        currency: form.currency as Currency,
        branches:0,
        users:0,
        status:"Active"
      },
      ...tenants
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
              Tenants
            </h1>

            <p className="text-slate-500">
              Manage organizations using the platform
            </p>

          </div>


          <button
            onClick={()=>setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >

            <Lucide.Plus size={18}/>

            New Tenant

          </button>


        </div>






        <div className="grid grid-cols-4 gap-5 mb-8">


          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Total Tenants
            </p>

            <h2 className="text-4xl font-black">
              {tenants.length}
            </h2>

          </div>



          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Active
            </p>

            <h2 className="text-4xl font-black text-green-600">
              {tenants.filter(t=>t.status==="Active").length}
            </h2>

          </div>




          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Branches
            </p>

            <h2 className="text-4xl font-black text-blue-600">
              {tenants.reduce((a,b)=>a+b.branches,0)}
            </h2>

          </div>




          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Users
            </p>

            <h2 className="text-4xl font-black">
              {tenants.reduce((a,b)=>a+b.users,0)}
            </h2>

          </div>


        </div>






        <div className="bg-white border rounded-2xl overflow-hidden">


          <table className="w-full">


            <thead className="bg-slate-100">

              <tr>

                <th className="p-4 text-left">
                  ID
                </th>

                <th className="p-4 text-left">
                  Tenant Name
                </th>

                <th className="p-4 text-left">
                  Code
                </th>

                <th className="p-4 text-left">
                  Country
                </th>

                <th className="p-4 text-left">
                  Currency
                </th>

                <th className="p-4 text-left">
                  Branches
                </th>

                <th className="p-4 text-left">
                  Users
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

              </tr>

            </thead>




            <tbody>


            {tenants.map(tenant=>(

              <tr
                key={tenant.id}
                className="border-t"
              >


                <td className="p-4 font-bold">
                  {tenant.id}
                </td>


                <td className="p-4 font-bold text-blue-700">
                  {tenant.name}
                </td>


                <td className="p-4">
                  {tenant.code}
                </td>


                <td className="p-4">
                  {tenant.country}
                </td>


                <td className="p-4">
                  {tenant.currency}
                </td>


                <td className="p-4">
                  {tenant.branches}
                </td>


                <td className="p-4">
                  {tenant.users}
                </td>


                <td className="p-4">

                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                    {tenant.status}
                  </span>

                </td>


              </tr>

            ))}


            </tbody>


          </table>


        </div>







        {showModal && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">


            <div className="bg-white rounded-3xl p-8 w-[600px]">


              <h2 className="text-2xl font-black mb-6">
                New Tenant
              </h2>



              <div className="space-y-4">


                <input
                className="border rounded-xl p-3 w-full"
                placeholder="Organization Name"
                onChange={e=>setForm({...form,name:e.target.value})}
                />


                <input
                className="border rounded-xl p-3 w-full"
                placeholder="Tenant Code"
                onChange={e=>setForm({...form,code:e.target.value})}
                />


                <input
                className="border rounded-xl p-3 w-full"
                placeholder="Country"
                onChange={e=>setForm({...form,country:e.target.value})}
                />


                <input
                className="border rounded-xl p-3 w-full"
                placeholder="Currency"
                onChange={e=>setForm({...form,currency:e.target.value as Currency})}
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
                onClick={addTenant}
                className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold"
                >
                  Save Tenant
                </button>


              </div>


            </div>


          </div>

        )}


      </main>

    </div>

  );

};
