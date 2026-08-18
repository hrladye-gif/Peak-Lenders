import { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";
import { getCurrency, formatMoney, type Currency } from "../config/regional";

export const Accounts = () => {

  const [showModal,setShowModal] = useState(false);

  const [accounts,setAccounts] = useState([
    {
      id:"SA-0001",
      accountNo:"100000001",
      customer:"John Doe",
      product:"Regular Savings",
      currency: getCurrency() as Currency,
      balance:450000,
      status:"Active"
    },
    {
      id:"SA-0002",
      accountNo:"100000002",
      customer:"Mary Namukasa",
      product:"Fixed Deposit",
      currency: getCurrency() as Currency,
      balance:1200000,
      status:"Active"
    }
  ]);


  const [form,setForm]=useState({
    accountNo:"",
    customer:"",
    product:"",
    currency: getCurrency() as Currency,
    balance:""
  });


  const createAccount=()=>{

    setAccounts([
      {
        id:`SA-${String(accounts.length+1).padStart(4,"0")}`,
        ...form,
        balance:Number(form.balance),
        status:"Active"
      },
      ...accounts
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
              Savings Accounts
            </h1>

            <p className="text-slate-500">
              Manage customer savings accounts
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


          <div className="bg-white rounded-2xl border p-6">
            <p className="text-sm text-slate-500">
              Total Accounts
            </p>

            <h2 className="text-4xl font-black">
              {accounts.length}
            </h2>
          </div>



          <div className="bg-white rounded-2xl border p-6">

            <p className="text-sm text-slate-500">
              Total Savings
            </p>

            <h2 className="text-4xl font-black text-blue-600">
              {accounts.reduce((a,b)=>a+b.balance,0).toLocaleString()}
            </h2>

          </div>



          <div className="bg-white rounded-2xl border p-6">

            <p className="text-sm text-slate-500">
              Active Accounts
            </p>

            <h2 className="text-4xl font-black text-green-600">
              {accounts.filter(a=>a.status==="Active").length}
            </h2>

          </div>



          <div className="bg-white rounded-2xl border p-6">

            <p className="text-sm text-slate-500">
              Products Used
            </p>

            <h2 className="text-4xl font-black">
              {new Set(accounts.map(a=>a.product)).size}
            </h2>

          </div>


        </div>




        <div className="bg-white rounded-2xl border overflow-hidden">


          <table className="w-full">


            <thead className="bg-slate-100">

              <tr>

                <th className="p-4 text-left">Account ID</th>
                <th className="p-4 text-left">Account Number</th>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Product</th>
                <th className="p-4 text-left">Currency</th>
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


                <td className="p-4">
                  {account.accountNo}
                </td>


                <td className="p-4 font-bold text-blue-700">
                  {account.customer}
                </td>


                <td className="p-4">
                  {account.product}
                </td>


                <td className="p-4">
                  {account.currency}
                </td>


                <td className="p-4 font-bold">
                  {Number(account.balance).toLocaleString()}
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
              Open Savings Account
            </h2>


            <div className="space-y-3">


              <input
                className="border rounded-xl p-3 w-full"
                placeholder="Account Number"
                onChange={e=>setForm({...form,accountNo:e.target.value})}
              />


              <input
                className="border rounded-xl p-3 w-full"
                placeholder="Customer Name"
                onChange={e=>setForm({...form,customer:e.target.value})}
              />


              <input
                className="border rounded-xl p-3 w-full"
                placeholder="Savings Product"
                onChange={e=>setForm({...form,product:e.target.value})}
              />


              <input
                className="border rounded-xl p-3 w-full"
                placeholder="Currency"
                onChange={e=>setForm({...form,currency:e.target.value as Currency})}
              />


              <input
                className="border rounded-xl p-3 w-full"
                placeholder="Opening Balance"
                onChange={e=>setForm({...form,balance:e.target.value})}
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
                onClick={createAccount}
                className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold"
              >
                Create Account
              </button>


            </div>


          </div>


        </div>

        )}


      </main>

    </div>

  );

};
