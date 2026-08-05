import { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";

export const Products = () => {

  const [showModal,setShowModal] = useState(false);

  const [products,setProducts] = useState([
    {
      id:"SP-0001",
      name:"Regular Savings",
      type:"Savings",
      currency:"UGX",
      interest:"5%",
      minimum:10000,
      status:"Active"
    },
    {
      id:"SP-0002",
      name:"Fixed Deposit",
      type:"Deposit",
      currency:"UGX",
      interest:"8%",
      minimum:100000,
      status:"Active"
    }
  ]);


  const [form,setForm]=useState({
    name:"",
    type:"",
    currency:"",
    interest:"",
    minimum:""
  });


  const saveProduct=()=>{

    setProducts([
      {
        id:`SP-${String(products.length+1).padStart(4,"0")}`,
        ...form,
        minimum:Number(form.minimum),
        status:"Active"
      },
      ...products
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
              Savings Products
            </h1>

            <p className="text-slate-500">
              Manage savings and deposit products
            </p>
          </div>


          <button
            onClick={()=>setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Lucide.Plus size={18}/>
            New Product
          </button>

        </div>



        <div className="grid grid-cols-4 gap-5 mb-8">

          <div className="bg-white rounded-2xl border p-6">
            <p className="text-slate-500 text-sm">
              Total Products
            </p>
            <h2 className="text-4xl font-black">
              {products.length}
            </h2>
          </div>


          <div className="bg-white rounded-2xl border p-6">
            <p className="text-slate-500 text-sm">
              Active
            </p>
            <h2 className="text-4xl font-black text-green-600">
              {products.filter(p=>p.status==="Active").length}
            </h2>
          </div>


          <div className="bg-white rounded-2xl border p-6">
            <p className="text-slate-500 text-sm">
              Savings Types
            </p>
            <h2 className="text-4xl font-black">
              {products.filter(p=>p.type==="Savings").length}
            </h2>
          </div>


          <div className="bg-white rounded-2xl border p-6">
            <p className="text-slate-500 text-sm">
              Deposit Types
            </p>
            <h2 className="text-4xl font-black">
              {products.filter(p=>p.type==="Deposit").length}
            </h2>
          </div>


        </div>




        <div className="bg-white rounded-2xl border overflow-hidden">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>
                <th className="p-4 text-left">Code</th>
                <th className="p-4 text-left">Product Name</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Currency</th>
                <th className="p-4 text-left">Interest</th>
                <th className="p-4 text-left">Minimum Balance</th>
                <th className="p-4 text-left">Status</th>
              </tr>

            </thead>


            <tbody>

            {products.map(product=>(

              <tr key={product.id} className="border-t">

                <td className="p-4 font-bold">
                  {product.id}
                </td>

                <td className="p-4 font-bold text-blue-700">
                  {product.name}
                </td>

                <td className="p-4">
                  {product.type}
                </td>

                <td className="p-4">
                  {product.currency}
                </td>

                <td className="p-4">
                  {product.interest}
                </td>

                <td className="p-4">
                  {Number(product.minimum).toLocaleString()}
                </td>

                <td className="p-4">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    {product.status}
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
              Create Savings Product
            </h2>


            <div className="space-y-3">


              <input
              className="border rounded-xl p-3 w-full"
              placeholder="Product Name"
              onChange={e=>setForm({...form,name:e.target.value})}
              />


              <input
              className="border rounded-xl p-3 w-full"
              placeholder="Type (Savings/Deposit)"
              onChange={e=>setForm({...form,type:e.target.value})}
              />


              <input
              className="border rounded-xl p-3 w-full"
              placeholder="Currency"
              onChange={e=>setForm({...form,currency:e.target.value})}
              />


              <input
              className="border rounded-xl p-3 w-full"
              placeholder="Interest Rate"
              onChange={e=>setForm({...form,interest:e.target.value})}
              />


              <input
              className="border rounded-xl p-3 w-full"
              placeholder="Minimum Balance"
              onChange={e=>setForm({...form,minimum:e.target.value})}
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
              onClick={saveProduct}
              className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold"
              >
                Save Product
              </button>


            </div>


          </div>

        </div>

        )}


      </main>

    </div>

  );
};
