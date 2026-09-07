import { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";

export const ChartOfAccounts = () => {

  const [showModal,setShowModal] = useState(false);

  const [accounts,setAccounts] = useState([
    {
      id:"1000",
      name:"Cash",
      type:"Asset",
      category:"Current Asset",
      balance:2500000,
      status:"Active"
    },
    {
      id:"1100",
      name:"Bank Account",
      type:"Asset",
      category:"Current Asset",
      balance:8500000,
      status:"Active"
    },
    {
      id:"2000",
      name:"Customer Savings",
      type:"Liability",
      category:"Deposits",
      balance:15000000,
      status:"Active"
    },
    {
      id:"4000",
      name:"Interest Income",
      type:"Income",
      category:"Revenue",
      balance:3200000,
      status:"Active"
    }
  ]);


  const [form,setForm]=useState({
    code:"",
    name:"",
    type:"",
    category:""
  });



  const saveAccount=()=>{

    setAccounts([
      {
        id:form.code,
        name:form.name,
        type:form.type,
        category:form.category,
        balance:0,
        status:"Active"
      },
      ...accounts
    ]);

    setShowModal(false);

  };



  const totalAccounts = accounts.length;



  return (

    <div className="flex h-screen bg-slate-50">

      <Sidebar />


      <main className="flex-1 p-8 overflow-y-auto">


        <div className="flex justify-between items-center mb-8">


          <div>

            <h1 className="text-4xl font-black">
              Chart of Accounts
            </h1>

            <p className="text-slate-500">
              Manage accounting structure and financial accounts
            </p>

          </div>



          <button
            onClick={()=>setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Lucide.Plus size={18}/>
            New Account
          </button>


        </div>




        <div className="grid grid-cols-4 gap-5 mb-8">


          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Total Accounts
            </p>
            <h2 className="text-4xl font-black">
              {totalAccounts}
            </h2>
          </div>


          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Assets
            </p>
            <h2 className="text-4xl font-black text-blue-600">
              {accounts.filter(a=>a.type==="Asset").length}
            </h2>
          </div>


          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Liabilities
            </p>
            <h2 className="text-4xl font-black text-red-600">
              {accounts.filter(a=>a.type==="Liability").length}
            </h2>
          </div>


          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Income Accounts
            </p>
            <h2 className="text-4xl font-black text-green-600">
              {accounts.filter(a=>a.type==="Income").length}
            </h2>
          </div>


        </div>





        <div className="bg-white border rounded-2xl overflow-hidden">


          <table className="w-full">


            <thead className="bg-slate-100">

              <tr>

                <th className="p-4 text-left">Account Code</th>
                <th className="p-4 text-left">Account Name</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Balance</th>
                <th className="p-4 text-left">Status</th>

              </tr>

            </thead>


            <tbody>


            {accounts.map(account=>(

              <tr key={account.id} className="border-t">


                <td className="p-4 font-bold">
                  {account.id}
                </td>


                <td className="p-4 font-bold text-blue-700">
                  {account.name}
                </td>


                <td className="p-4">
                  {account.type}
                </td>


                <td className="p-4">
                  {account.category}
                </td>


                <td className="p-4 font-bold">
                  {account.balance.toLocaleString()}
                </td>


                <td className="p-4">

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    {account.status}
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
              Create Account
            </h2>



            <div className="space-y-3">


              <input
              className="border rounded-xl p-3 w-full"
              placeholder="Account Code"
              onChange={e=>setForm({...form,code:e.target.value})}
              />


              <input
              className="border rounded-xl p-3 w-full"
              placeholder="Account Name"
              onChange={e=>setForm({...form,name:e.target.value})}
              />


              <input
              className="border rounded-xl p-3 w-full"
              placeholder="Type (Asset, Liability, Income, Expense)"
              onChange={e=>setForm({...form,type:e.target.value})}
              />


              <input
              className="border rounded-xl p-3 w-full"
              placeholder="Category"
              onChange={e=>setForm({...form,category:e.target.value})}
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
              onClick={saveAccount}
              className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold"
              >
                Save Account
              </button>


            </div>


          </div>


        </div>

        )}


      </main>

    </div>

  );

};
